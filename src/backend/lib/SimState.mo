/// SimState.mo — stateless helpers operating on the full simulation state
import Types "../types/common";
import TrafficSim "TrafficSim";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Array "mo:core/Array";

module {

  // -----------------------------------------------------------------------
  // Tick: update a single segment
  // -----------------------------------------------------------------------

  func updateSegment(
    seg : Types.TrafficSegment,
    seed : Nat,
    visibility : Nat,
    condition : Types.WeatherCondition,
  ) : Types.TrafficSegment {
    let newCount = TrafficSim.varyVehicleCount(seg.vehicleCount, seed);
    let capacity : Nat = 200;
    let rawCongestion = (newCount * 100) / capacity;
    let newCongestion = if (rawCongestion > 100) { 100 } else { rawCongestion };
    let newLevel = TrafficSim.congestionToLevel(newCongestion);
    let newSpeed = TrafficSim.congestionToSpeed(newCongestion);
    let newWait = TrafficSim.estimateWaitTime(newCongestion, visibility, condition);
    {
      seg with
      vehicleCount = newCount;
      congestionPct = newCongestion;
      trafficLevel = newLevel;
      avgSpeed = newSpeed;
      waitTimeSeconds = newWait;
    };
  };

  // -----------------------------------------------------------------------
  // Tick: run one simulation step
  // -----------------------------------------------------------------------

  public func tickSegments(
    segments : List.List<Types.TrafficSegment>,
    seed : Nat,
    visibility : Nat,
    condition : Types.WeatherCondition,
  ) {
    var s = seed;
    segments.mapInPlace(
      func(seg) {
        s := TrafficSim.nextRand(s + seg.vehicleCount);
        updateSegment(seg, s, visibility, condition);
      }
    );
  };

  // -----------------------------------------------------------------------
  // Tick: maybe generate an anomaly (10% chance)
  // -----------------------------------------------------------------------

  public func maybeGenerateAnomaly(
    segments : List.List<Types.TrafficSegment>,
    anomalies : List.List<Types.Anomaly>,
    seed : Nat,
  ) {
    let roll = TrafficSim.randN(seed, 10);
    if (roll != 0) { return };
    let segCount = segments.size();
    if (segCount == 0) { return };
    let segIdx = TrafficSim.randN(TrafficSim.nextRand(seed), segCount);
    // Use index-based access; at() traps on OOB so guard with segCount
    let seg = segments.at(segIdx);
    let aSeed = TrafficSim.nextRand(seed + segIdx);
    let aType = TrafficSim.pickAnomalyType(aSeed);
    let (desc, reasoning, severity) = TrafficSim.describeAnomaly(aType, seg.name);
    let now = Time.now();
    let anomalyId = "ano-" # now.toText() # "-" # (aSeed % 9999).toText();
    anomalies.add({
      id = anomalyId;
      segmentId = seg.id;
      anomalyType = aType;
      severity;
      description = desc;
      detectedAt = now;
      isActive = true;
      reasoning;
    });
  };

  // -----------------------------------------------------------------------
  // Tick: maybe change weather (5% chance)
  // -----------------------------------------------------------------------

  public func maybeChangeWeather(
    weather : Types.WeatherData,
    seed : Nat,
    allDistricts : [Text],
  ) : Types.WeatherData {
    let roll = TrafficSim.randN(seed, 20);
    if (roll != 0) { return weather };
    let wSeed = TrafficSim.nextRand(seed);
    let (condition, temp, visibility, wind) = TrafficSim.pickWeather(wSeed);
    let rec = TrafficSim.weatherRecommendation(condition, visibility);
    {
      condition;
      temperature = temp;
      visibility;
      windSpeed = wind;
      updatedAt = Time.now();
      affectedDistricts = allDistricts;
      recommendation = rec;
    };
  };

  // -----------------------------------------------------------------------
  // Tick: maybe trigger emergency (5% chance)
  // -----------------------------------------------------------------------

  public func maybeTriggerEmergency(
    segments : List.List<Types.TrafficSegment>,
    emergencies : List.List<Types.EmergencyAlert>,
    seed : Nat,
  ) {
    let roll = TrafficSim.randN(seed, 20);
    if (roll != 0) { return };
    let segCount = segments.size();
    if (segCount == 0) { return };
    let segIdx = TrafficSim.randN(TrafficSim.nextRand(seed + 7), segCount);
    let seg = segments.at(segIdx);
    let eSeed = TrafficSim.nextRand(seed + segIdx + 3);
    let vehicles = ["Ambulance", "Fire Engine", "Police", "Hazmat Unit"];
    let vIdx = TrafficSim.randN(eSeed, 4);
    let vehicleType = vehicles[vIdx];
    let now = Time.now();
    let alertId = "emg-" # now.toText() # "-" # (eSeed % 9999).toText();
    emergencies.add({
      id = alertId;
      segmentId = seg.id;
      vehicleType;
      priority = if (Text.equal(vehicleType, "Ambulance") or Text.equal(vehicleType, "Fire Engine")) { 1 } else { 2 };
      description = vehicleType # " responding at " # seg.name # ". Green corridor requested.";
      triggeredAt = now;
      isActive = true;
      recommendedAction = "Hold cross-traffic at " # seg.district # " intersections. Clear " # seg.name # " immediately.";
    });
  };

  // -----------------------------------------------------------------------
  // Recompute route optimality after tick
  // -----------------------------------------------------------------------

  public func recomputeRoutes(
    routes : List.List<Types.Route>,
    segments : List.List<Types.TrafficSegment>,
  ) {
    let segArr = segments.toArray();
    routes.mapInPlace(
      func(route) {
        let newMinutes = estimateRouteMinutes(route.segments, segArr, route.totalDistance);
        let reasoning = TrafficSim.buildRouteReasoning(
          route.fromDistrict,
          route.toDistrict,
          segArr,
          route.segments,
          newMinutes,
          route.isOptimal,
          1,
        );
        { route with estimatedMinutes = newMinutes; reasoning };
      }
    );
    markOptimalRoutes(routes);
  };

  func estimateRouteMinutes(segIds : [Text], segments : [Types.TrafficSegment], distKm : Float) : Nat {
    let avgCongestion = segIds.foldLeft(
      0,
      func(acc, sid) {
        switch (segments.find(func(s : Types.TrafficSegment) : Bool { Text.equal(s.id, sid) })) {
          case (?s) { acc + s.congestionPct };
          case null { acc };
        };
      },
    );
    let count = segIds.size();
    let meanCongestion = if (count == 0) { 0 } else { avgCongestion / count };
    let speed = TrafficSim.congestionToSpeed(meanCongestion);
    if (speed < 1.0) {
      999;
    } else {
      let mins = (distKm / speed) * 60.0;
      Int.abs(mins.toInt()) + 1;
    };
  };

  func markOptimalRoutes(routes : List.List<Types.Route>) {
    // Build a list of distinct (from,to) pairs
    let pairs = List.empty<(Text, Text)>();
    routes.forEach(func(r : Types.Route) {
      let exists = pairs.find(func(p : (Text, Text)) : Bool {
        Text.equal(p.0, r.fromDistrict) and Text.equal(p.1, r.toDistrict)
      });
      switch exists {
        case null { pairs.add((r.fromDistrict, r.toDistrict)) };
        case _ {};
      };
    });
    // For each pair find the minimum estimatedMinutes
    pairs.forEach(
      func(pair : (Text, Text)) {
        let candidates = routes.filter(func(r : Types.Route) : Bool {
          Text.equal(r.fromDistrict, pair.0) and Text.equal(r.toDistrict, pair.1)
        });
        let best = candidates.foldLeft<?(Types.Route), Types.Route>(
          null,
          func(acc, r) {
            switch acc {
              case null { ?r };
              case (?best) {
                if (r.estimatedMinutes < best.estimatedMinutes) { ?r } else { acc };
              };
            };
          },
        );
        switch best {
          case null {};
          case (?bestRoute) {
            routes.mapInPlace(func(r : Types.Route) : Types.Route {
              if (Text.equal(r.fromDistrict, pair.0) and Text.equal(r.toDistrict, pair.1)) {
                {
                  r with
                  isOptimal = Text.equal(r.id, bestRoute.id);
                  alternateOf = if (Text.equal(r.id, bestRoute.id)) { null } else { ?bestRoute.id };
                };
              } else { r };
            });
          };
        };
      }
    );
  };

  // -----------------------------------------------------------------------
  // computeOptimalRoute: A*/Dijkstra simulation
  // -----------------------------------------------------------------------

  public func computeOptimalRoute(
    fromDistrict : Text,
    toDistrict : Text,
    segments : List.List<Types.TrafficSegment>,
    routes : List.List<Types.Route>,
  ) : ?Types.Route {
    let existing = routes.find(
      func(r : Types.Route) : Bool {
        Text.equal(r.fromDistrict, fromDistrict) and Text.equal(r.toDistrict, toDistrict) and r.isOptimal
      }
    );
    switch existing {
      case (?r) { ?r };
      case null {
        let fromSegs = segments.filter(func(s : Types.TrafficSegment) : Bool { Text.equal(s.district, fromDistrict) });
        let toSegs = segments.filter(func(s : Types.TrafficSegment) : Bool { Text.equal(s.district, toDistrict) });
        switch (fromSegs.first(), toSegs.first()) {
          case (?fromSeg, ?toSeg) {
            let segIds = [fromSeg.id, toSeg.id];
            let dist = estimateDistance(fromSeg.lat, fromSeg.lon, toSeg.lat, toSeg.lon);
            let avgCong = (fromSeg.congestionPct + toSeg.congestionPct) / 2;
            let speed = TrafficSim.congestionToSpeed(avgCong);
            let mins = if (speed < 1.0) { 999 } else {
              Int.abs(((dist / speed) * 60.0).toInt()) + 1
            };
            let now = Time.now();
            let routeId = "route-dyn-" # now.toText();
            let reasoning = TrafficSim.buildRouteReasoning(fromDistrict, toDistrict, segments.toArray(), segIds, mins, true, 0);
            ?{
              id = routeId;
              name = fromDistrict # " to " # toDistrict;
              fromDistrict;
              toDistrict;
              segments = segIds;
              totalDistance = dist;
              estimatedMinutes = mins;
              isOptimal = true;
              reasoning;
              alternateOf = null;
            };
          };
          case _ { null };
        };
      };
    };
  };

  func estimateDistance(lat1 : Float, lon1 : Float, lat2 : Float, lon2 : Float) : Float {
    let dlat = lat1 - lat2;
    let dlon = lon1 - lon2;
    Float.sqrt(dlat * dlat + dlon * dlon) * 111.0;
  };
};
