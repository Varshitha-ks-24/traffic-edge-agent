import Types "../types/common";
import List "mo:core/List";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";

module {
  // -----------------------------------------------------------------------
  // Pseudo-random helpers
  // -----------------------------------------------------------------------

  /// Simple LCG-style seeded from an Int value (nanosecond time + vehicleCount mix)
  public func nextRand(seed : Nat) : Nat {
    (seed * 6364136223846793005 + 1442695040888963407) % 4294967296;
  };

  /// Map a Nat seed to 0..range-1
  public func randN(seed : Nat, range : Nat) : Nat {
    if (range == 0) { 0 } else { seed % range };
  };

  // -----------------------------------------------------------------------
  // Seed derivation from current segments state
  // -----------------------------------------------------------------------

  public func deriveSeed(segments : List.List<Types.TrafficSegment>) : Nat {
    let base = Int.abs(Time.now());
    let extra = segments.foldLeft(
      0,
      func(acc, s) { acc + s.vehicleCount },
    );
    base + extra;
  };

  // -----------------------------------------------------------------------
  // Traffic level thresholds
  // -----------------------------------------------------------------------

  public func congestionToLevel(pct : Nat) : Types.TrafficLevel {
    if (pct > 70) { #High }
    else if (pct >= 35) { #Medium }
    else if (pct > 0) { #Low }
    else { #NoTraffic };
  };

  // -----------------------------------------------------------------------
  // Wait time estimation
  // -----------------------------------------------------------------------

  /// Base wait time amplified by congestion and weather visibility
  public func estimateWaitTime(congestionPct : Nat, visibility : Nat, condition : Types.WeatherCondition) : Nat {
    let base : Nat = (congestionPct * 3) / 10; // seconds per pct
    let weatherPenalty : Nat = switch condition {
      case (#Clear) { 0 };
      case (#Rain) { 30 };
      case (#Fog) { 60 };
      case (#Storm) { 120 };
      case (#Snow) { 90 };
    };
    let visPenalty : Nat = if (visibility < 200) { 60 } else if (visibility < 500) { 20 } else { 0 };
    base + weatherPenalty + visPenalty;
  };

  // -----------------------------------------------------------------------
  // avgSpeed from congestion
  // -----------------------------------------------------------------------

  public func congestionToSpeed(congestionPct : Nat) : Float {
    let maxSpeed : Float = 80.0;
    let factor : Float = 1.0 - (congestionPct.toFloat() / 100.0);
    if (factor < 0.1) { maxSpeed * 0.1 } else { maxSpeed * factor };
  };

  // -----------------------------------------------------------------------
  // Vary vehicle count ±15%
  // -----------------------------------------------------------------------

  public func varyVehicleCount(current : Nat, seed : Nat) : Nat {
    let delta = randN(seed, 31);
    let minCount : Nat = 1;
    let newCount : Int = Int.fromNat(current) + (Int.fromNat(delta) - 15);
    if (newCount < Int.fromNat(minCount)) { minCount } else { Int.abs(newCount) };
  };

  // -----------------------------------------------------------------------
  // Anomaly description generation
  // -----------------------------------------------------------------------

  public func describeAnomaly(aType : Types.AnomalyType, segName : Text) : (Text, Text, Types.AlertSeverity) {
    switch aType {
      case (#Pedestrian) {
        (
          "Pedestrian detected crossing irregularly at " # segName,
          "CV pipeline flagged irregular pedestrian movement. Signal hold recommended for 30s.",
          #Medium,
        );
      };
      case (#Animal) {
        (
          "Animal obstruction on roadway at " # segName,
          "Object detection model (confidence 0.91) identified large animal. Lane closure recommended.",
          #High,
        );
      };
      case (#Obstacle) {
        (
          "Road obstacle detected at " # segName,
          "LIDAR + camera fusion detected stationary debris. Rerouting vehicles to adjacent lane.",
          #High,
        );
      };
      case (#Accident) {
        (
          "Vehicle accident reported at " # segName,
          "Multi-sensor anomaly detected: velocity drop + stopped vehicles. Emergency dispatch triggered.",
          #Critical,
        );
      };
      case (#VehicleBreakdown) {
        (
          "Vehicle breakdown blocking lane at " # segName,
          "Speed deviation model detected stalled vehicle. Advisory broadcast to upstream traffic.",
          #Medium,
        );
      };
      case (#EmergencyVehicle) {
        (
          "Emergency vehicle en route through " # segName,
          "Siren frequency detected by audio sensor. Green corridor activated; cross-traffic held.",
          #Critical,
        );
      };
    };
  };

  // -----------------------------------------------------------------------
  // Route reasoning builder
  // -----------------------------------------------------------------------

  public func buildRouteReasoning(
    fromDistrict : Text,
    toDistrict : Text,
    segments : [Types.TrafficSegment],
    routeSegIds : [Text],
    estimatedMinutes : Nat,
    isOptimal : Bool,
    altCount : Nat,
  ) : Text {
    // find congestion on path segments
    let pathCongestion = routeSegIds.foldLeft(
      0,
      func(acc, sid) {
        switch (segments.find(func(s : Types.TrafficSegment) : Bool { Text.equal(s.id, sid) })) {
          case (?s) { Nat.max(acc, s.congestionPct) };
          case null { acc };
        };
      },
    );
    let optimality = if (isOptimal) { "Optimal" } else { "Alternate" };
    optimality
    # " path "
    # fromDistrict
    # " → "
    # toDistrict
    # ": "
    # estimatedMinutes.toText()
    # " min. Max congestion on path: "
    # pathCongestion.toText()
    # "%. "
    # altCount.toText()
    # " alternatives available.";
  };

  // -----------------------------------------------------------------------
  // System health score
  // -----------------------------------------------------------------------

  public func computeSystemHealth(components : List.List<Types.SystemComponent>) : Nat {
    if (components.isEmpty()) { return 100 };
    let total = components.size();
    let operational = components.foldLeft(
      0,
      func(acc, c) {
        switch (c.status) {
          case (#Operational) { acc + 1 };
          case (#Degraded) { acc }; // counts as partial but don't add here
          case _ { acc };
        };
      },
    );
    let degraded = components.foldLeft(
      0,
      func(acc, c) {
        switch (c.status) {
          case (#Degraded) { acc + 1 };
          case _ { acc };
        };
      },
    );
    ((operational * 100) + (degraded * 50)) / total;
  };

  // -----------------------------------------------------------------------
  // Weather recommendation
  // -----------------------------------------------------------------------

  public func weatherRecommendation(condition : Types.WeatherCondition, visibility : Nat) : Text {
    switch condition {
      case (#Clear) { "All routes nominal. No weather-related restrictions." };
      case (#Rain) { "Reduce speed by 20%. Allow extra following distance. Expect 15-30s signal delays." };
      case (#Fog) {
        if (visibility < 200) {
          "Low-visibility fog: activate fog lights, reduce speed 40%. Recommend avoiding highway routes."
        } else {
          "Moderate fog detected. Reduce speed 20%. Use fog lights."
        };
      };
      case (#Storm) { "Severe storm: non-essential travel advisory. Emergency routes only. Expect 2-4x normal delays." };
      case (#Snow) { "Snow conditions: chains/snow tyres required on elevated routes. Speed limit reduced 30%." };
    };
  };

  // -----------------------------------------------------------------------
  // Initial segment data
  // -----------------------------------------------------------------------

  public func initialSegments() : [Types.TrafficSegment] {
    [
      {
        id = "seg-001";
        name = "Main St Corridor";
        district = "Downtown Core";
        trafficLevel = #Medium;
        vehicleCount = 120;
        avgSpeed = 45.0;
        waitTimeSeconds = 60;
        lat = 40.7128;
        lon = -74.006;
        congestionPct = 55;
      },
      {
        id = "seg-002";
        name = "Central Avenue";
        district = "Downtown Core";
        trafficLevel = #High;
        vehicleCount = 200;
        avgSpeed = 20.0;
        waitTimeSeconds = 90;
        lat = 40.7135;
        lon = -74.0045;
        congestionPct = 78;
      },
      {
        id = "seg-003";
        name = "Business Park Blvd";
        district = "Westside Business District";
        trafficLevel = #Medium;
        vehicleCount = 95;
        avgSpeed = 50.0;
        waitTimeSeconds = 40;
        lat = 40.7089;
        lon = -74.0210;
        congestionPct = 45;
      },
      {
        id = "seg-004";
        name = "Commerce Ring Rd";
        district = "Westside Business District";
        trafficLevel = #Low;
        vehicleCount = 40;
        avgSpeed = 65.0;
        waitTimeSeconds = 15;
        lat = 40.7075;
        lon = -74.0240;
        congestionPct = 22;
      },
      {
        id = "seg-005";
        name = "Residential Lane North";
        district = "Eastside Residential";
        trafficLevel = #Low;
        vehicleCount = 30;
        avgSpeed = 60.0;
        waitTimeSeconds = 10;
        lat = 40.7150;
        lon = -73.9920;
        congestionPct = 18;
      },
      {
        id = "seg-006";
        name = "Elm Street South";
        district = "Eastside Residential";
        trafficLevel = #Medium;
        vehicleCount = 70;
        avgSpeed = 48.0;
        waitTimeSeconds = 35;
        lat = 40.7140;
        lon = -73.9900;
        congestionPct = 40;
      },
      {
        id = "seg-007";
        name = "Industrial Parkway";
        district = "North Industrial Zone";
        trafficLevel = #Low;
        vehicleCount = 55;
        avgSpeed = 62.0;
        waitTimeSeconds = 20;
        lat = 40.7230;
        lon = -74.0050;
        congestionPct = 28;
      },
      {
        id = "seg-008";
        name = "Freight Terminal Rd";
        district = "North Industrial Zone";
        trafficLevel = #Medium;
        vehicleCount = 88;
        avgSpeed = 42.0;
        waitTimeSeconds = 50;
        lat = 40.7245;
        lon = -74.0030;
        congestionPct = 48;
      },
    ];
  };

  // -----------------------------------------------------------------------
  // Initial system components
  // -----------------------------------------------------------------------

  public func initialComponents() : [Types.SystemComponent] {
    let now = Time.now();
    [
      {
        id = "comp-001";
        name = "Traffic Flow ML Model";
        componentType = "AI/ML";
        status = #Operational;
        lastChecked = now;
        uptimePct = 99.8;
        failureCount = 0;
      },
      {
        id = "comp-002";
        name = "Computer Vision Pipeline";
        componentType = "AI/Vision";
        status = #Operational;
        lastChecked = now;
        uptimePct = 99.5;
        failureCount = 1;
      },
      {
        id = "comp-003";
        name = "Route Optimization Engine";
        componentType = "Algorithm";
        status = #Operational;
        lastChecked = now;
        uptimePct = 100.0;
        failureCount = 0;
      },
      {
        id = "comp-004";
        name = "Weather Data Integrator";
        componentType = "Data Feed";
        status = #Operational;
        lastChecked = now;
        uptimePct = 98.2;
        failureCount = 2;
      },
      {
        id = "comp-005";
        name = "Emergency Detection Module";
        componentType = "AI/Safety";
        status = #Operational;
        lastChecked = now;
        uptimePct = 99.9;
        failureCount = 0;
      },
      {
        id = "comp-006";
        name = "Sensor Network Gateway";
        componentType = "Infrastructure";
        status = #Degraded;
        lastChecked = now;
        uptimePct = 94.1;
        failureCount = 5;
      },
    ];
  };

  // -----------------------------------------------------------------------
  // Initial routes
  // -----------------------------------------------------------------------

  public func initialRoutes() : [Types.Route] {
    [
      {
        id = "route-001";
        name = "Downtown to Westside Express";
        fromDistrict = "Downtown Core";
        toDistrict = "Westside Business District";
        segments = ["seg-001", "seg-003"];
        totalDistance = 4.2;
        estimatedMinutes = 12;
        isOptimal = true;
        reasoning = "Optimal path via Main St Corridor: 12 min. Avoids Central Ave (78% congestion). 2 alternatives available.";
        alternateOf = null;
      },
      {
        id = "route-002";
        name = "Downtown to Westside via Central";
        fromDistrict = "Downtown Core";
        toDistrict = "Westside Business District";
        segments = ["seg-002", "seg-003", "seg-004"];
        totalDistance = 5.8;
        estimatedMinutes = 22;
        isOptimal = false;
        reasoning = "Alternate route via Central Ave. Higher congestion (78%) adds 10 min vs optimal route.";
        alternateOf = ?"route-001";
      },
      {
        id = "route-003";
        name = "Downtown to Eastside Connector";
        fromDistrict = "Downtown Core";
        toDistrict = "Eastside Residential";
        segments = ["seg-001", "seg-005"];
        totalDistance = 3.5;
        estimatedMinutes = 9;
        isOptimal = true;
        reasoning = "Optimal path Downtown → Eastside: 9 min. Low congestion (18%) on Residential Lane North.";
        alternateOf = null;
      },
      {
        id = "route-004";
        name = "Downtown to North Industrial";
        fromDistrict = "Downtown Core";
        toDistrict = "North Industrial Zone";
        segments = ["seg-001", "seg-007"];
        totalDistance = 6.1;
        estimatedMinutes = 14;
        isOptimal = true;
        reasoning = "Optimal path to North Industrial via Main St: 14 min. Industrial Parkway clear (28% congestion).";
        alternateOf = null;
      },
      {
        id = "route-005";
        name = "Westside to Eastside Cross-Town";
        fromDistrict = "Westside Business District";
        toDistrict = "Eastside Residential";
        segments = ["seg-004", "seg-001", "seg-006"];
        totalDistance = 7.3;
        estimatedMinutes = 18;
        isOptimal = true;
        reasoning = "Cross-town route via Commerce Ring Rd: 18 min. Avoids congested Downtown Core segments.";
        alternateOf = null;
      },
      {
        id = "route-006";
        name = "North Industrial to Downtown Express";
        fromDistrict = "North Industrial Zone";
        toDistrict = "Downtown Core";
        segments = ["seg-008", "seg-002"];
        totalDistance = 5.0;
        estimatedMinutes = 19;
        isOptimal = false;
        reasoning = "Non-optimal: Freight Terminal Rd + Central Ave both show elevated congestion. Use alternate.";
        alternateOf = ?"route-004";
      },
    ];
  };

  // -----------------------------------------------------------------------
  // Anomaly type selection from seed
  // -----------------------------------------------------------------------

  public func pickAnomalyType(seed : Nat) : Types.AnomalyType {
    let idx = randN(seed, 6);
    switch idx {
      case 0 { #Pedestrian };
      case 1 { #Animal };
      case 2 { #Obstacle };
      case 3 { #Accident };
      case 4 { #VehicleBreakdown };
      case _ { #EmergencyVehicle };
    };
  };

  // -----------------------------------------------------------------------
  // Weather selection from seed
  // -----------------------------------------------------------------------

  public func pickWeather(seed : Nat) : (Types.WeatherCondition, Float, Nat, Float) {
    let idx = randN(seed, 5);
    switch idx {
      case 0 { (#Clear, 22.0, 10000, 8.0) };
      case 1 { (#Rain, 16.0, 3000, 25.0) };
      case 2 { (#Fog, 11.0, 150, 5.0) };
      case 3 { (#Storm, 8.0, 500, 65.0) };
      case _ { (#Snow, 0.0, 800, 30.0) };
    };
  };
};
