import Types "../types/common";
import TrafficSim "../lib/TrafficSim";
import SimState "../lib/SimState";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

mixin (
  segments : List.List<Types.TrafficSegment>,
  anomalies : List.List<Types.Anomaly>,
  routes : List.List<Types.Route>,
  incidents : List.List<Types.Incident>,
  weather : { var data : Types.WeatherData },
  components : List.List<Types.SystemComponent>,
  emergencies : List.List<Types.EmergencyAlert>,
  counters : { var incidentCounter : Nat; var tickCounter : Nat },
) {

  public query func getTrafficSnapshot() : async Types.TrafficSnapshot {
    let activeAnomalies = anomalies.filter(func(a : Types.Anomaly) : Bool { a.isActive }).toArray();
    let activeEmergencies = emergencies.filter(func(e : Types.EmergencyAlert) : Bool { e.isActive }).toArray();
    let health = TrafficSim.computeSystemHealth(components);
    {
      timestamp = Time.now();
      segments = segments.toArray();
      weather = weather.data;
      activeAnomalies;
      activeEmergencies;
      systemHealth = health;
    };
  };

  public query func getSegments() : async [Types.TrafficSegment] {
    segments.toArray();
  };

  public query func getAnomalies(activeOnly : Bool) : async [Types.Anomaly] {
    if (activeOnly) {
      anomalies.filter(func(a : Types.Anomaly) : Bool { a.isActive }).toArray();
    } else {
      anomalies.toArray();
    };
  };

  public query func getRoutes() : async [Types.Route] {
    routes.toArray();
  };

  public query func getIncidents() : async [Types.Incident] {
    incidents.toArray();
  };

  public query func getWeather() : async Types.WeatherData {
    weather.data;
  };

  public query func getSystemComponents() : async [Types.SystemComponent] {
    components.toArray();
  };

  public query func getEmergencyAlerts(activeOnly : Bool) : async [Types.EmergencyAlert] {
    if (activeOnly) {
      emergencies.filter(func(e : Types.EmergencyAlert) : Bool { e.isActive }).toArray();
    } else {
      emergencies.toArray();
    };
  };

  public query func computeOptimalRoute(fromDistrict : Text, toDistrict : Text) : async ?Types.Route {
    SimState.computeOptimalRoute(fromDistrict, toDistrict, segments, routes);
  };

  public query func getWaitTimeEstimate(segmentId : Text) : async Nat {
    switch (segments.find(func(s : Types.TrafficSegment) : Bool { Text.equal(s.id, segmentId) })) {
      case (?seg) { seg.waitTimeSeconds };
      case null { 0 };
    };
  };

  public func simulateTick() : async () {
    counters.tickCounter += 1;
    let seed = TrafficSim.deriveSeed(segments);
    let allDistricts = ["Downtown Core", "Westside Business District", "Eastside Residential", "North Industrial Zone"];
    let newWeather = SimState.maybeChangeWeather(weather.data, seed, allDistricts);
    weather.data := newWeather;
    SimState.tickSegments(segments, TrafficSim.nextRand(seed), newWeather.visibility, newWeather.condition);
    let aSeed = TrafficSim.nextRand(seed + counters.tickCounter);
    SimState.maybeGenerateAnomaly(segments, anomalies, aSeed);
    let eSeed = TrafficSim.nextRand(aSeed + 13);
    SimState.maybeTriggerEmergency(segments, emergencies, eSeed);
    let now = Time.now();
    components.mapInPlace(func(c : Types.SystemComponent) : Types.SystemComponent {
      { c with lastChecked = now };
    });
    SimState.recomputeRoutes(routes, segments);
  };

  public func reportIncident(segmentId : Text, incidentType : Text, reporterNote : Text) : async Types.Incident {
    counters.incidentCounter += 1;
    let now = Time.now();
    let incidentId = "inc-" # counters.incidentCounter.toText();
    let score = switch (segments.find(func(s : Types.TrafficSegment) : Bool { Text.equal(s.id, segmentId) })) {
      case (?seg) { 50 + (seg.congestionPct * 45) / 100 };
      case null { 50 };
    };
    let status : Types.IncidentStatus = if (score >= 70) { #Validated } else { #Pending };
    let incident : Types.Incident = {
      id = incidentId;
      reporterNote;
      segmentId;
      incidentType;
      status;
      reportedAt = now;
      validatedAt = if (status == #Validated) { ?now } else { null };
      validationScore = score;
    };
    incidents.add(incident);
    incident;
  };

  public func resolveAnomaly(anomalyId : Text) : async Bool {
    var found = false;
    anomalies.mapInPlace(func(a : Types.Anomaly) : Types.Anomaly {
      if (Text.equal(a.id, anomalyId) and a.isActive) {
        found := true;
        { a with isActive = false };
      } else { a };
    });
    found;
  };

  public func acknowledgeEmergency(alertId : Text) : async Bool {
    var found = false;
    emergencies.mapInPlace(func(e : Types.EmergencyAlert) : Types.EmergencyAlert {
      if (Text.equal(e.id, alertId) and e.isActive) {
        found := true;
        { e with isActive = false };
      } else { e };
    });
    found;
  };

  public func triggerEmergencySimulation(segmentId : Text, vehicleType : Text) : async Types.EmergencyAlert {
    let seg = switch (segments.find(func(s : Types.TrafficSegment) : Bool { Text.equal(s.id, segmentId) })) {
      case (?s) { s };
      case null { Runtime.trap("Segment not found: " # segmentId) };
    };
    let now = Time.now();
    let alertId = "emg-manual-" # now.toText();
    let alert : Types.EmergencyAlert = {
      id = alertId;
      segmentId;
      vehicleType;
      priority = if (Text.equal(vehicleType, "Ambulance") or Text.equal(vehicleType, "Fire Engine")) { 1 } else { 2 };
      description = vehicleType # " emergency simulation at " # seg.name # ".";
      triggeredAt = now;
      isActive = true;
      recommendedAction = "Clear " # seg.name # " in " # seg.district # ". Redirect cross-traffic. Priority green corridor activated.";
    };
    emergencies.add(alert);
    alert;
  };

  public func resetSimulation() : async () {
    segments.clear();
    anomalies.clear();
    incidents.clear();
    emergencies.clear();
    counters.incidentCounter := 0;
    counters.tickCounter := 0;
    let initSegs = TrafficSim.initialSegments();
    for (seg in initSegs.values()) {
      segments.add(seg);
    };
    components.clear();
    let initComps = TrafficSim.initialComponents();
    for (comp in initComps.values()) {
      components.add(comp);
    };
    routes.clear();
    let initRoutes = TrafficSim.initialRoutes();
    for (route in initRoutes.values()) {
      routes.add(route);
    };
    weather.data := {
      condition = #Clear;
      temperature = 20.0;
      visibility = 10000;
      windSpeed = 10.0;
      updatedAt = Time.now();
      affectedDistricts = ["Downtown Core", "Westside Business District", "Eastside Residential", "North Industrial Zone"];
      recommendation = "All routes nominal. No weather-related restrictions.";
    };
  };
};
