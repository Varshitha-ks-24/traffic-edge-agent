module {
  public type TrafficLevel = {
    #High;
    #Medium;
    #Low;
    #NoTraffic;
  };

  public type WeatherCondition = {
    #Clear;
    #Rain;
    #Fog;
    #Storm;
    #Snow;
  };

  public type AnomalyType = {
    #Pedestrian;
    #Animal;
    #Obstacle;
    #Accident;
    #VehicleBreakdown;
    #EmergencyVehicle;
  };

  public type AlertSeverity = {
    #Critical;
    #High;
    #Medium;
    #Low;
  };

  public type SystemStatus = {
    #Operational;
    #Degraded;
    #Failed;
    #Maintenance;
  };

  public type IncidentStatus = {
    #Pending;
    #Validated;
    #Rejected;
    #Resolved;
  };

  public type TrafficSegment = {
    id : Text;
    name : Text;
    district : Text;
    trafficLevel : TrafficLevel;
    vehicleCount : Nat;
    avgSpeed : Float;
    waitTimeSeconds : Nat;
    lat : Float;
    lon : Float;
    congestionPct : Nat;
  };

  public type Anomaly = {
    id : Text;
    segmentId : Text;
    anomalyType : AnomalyType;
    severity : AlertSeverity;
    description : Text;
    detectedAt : Int;
    isActive : Bool;
    reasoning : Text;
  };

  public type Route = {
    id : Text;
    name : Text;
    fromDistrict : Text;
    toDistrict : Text;
    segments : [Text];
    totalDistance : Float;
    estimatedMinutes : Nat;
    isOptimal : Bool;
    reasoning : Text;
    alternateOf : ?Text;
  };

  public type Incident = {
    id : Text;
    reporterNote : Text;
    segmentId : Text;
    incidentType : Text;
    status : IncidentStatus;
    reportedAt : Int;
    validatedAt : ?Int;
    validationScore : Nat;
  };

  public type WeatherData = {
    condition : WeatherCondition;
    temperature : Float;
    visibility : Nat;
    windSpeed : Float;
    updatedAt : Int;
    affectedDistricts : [Text];
    recommendation : Text;
  };

  public type SystemComponent = {
    id : Text;
    name : Text;
    componentType : Text;
    status : SystemStatus;
    lastChecked : Int;
    uptimePct : Float;
    failureCount : Nat;
  };

  public type EmergencyAlert = {
    id : Text;
    segmentId : Text;
    vehicleType : Text;
    priority : Nat;
    description : Text;
    triggeredAt : Int;
    isActive : Bool;
    recommendedAction : Text;
  };

  public type TrafficSnapshot = {
    timestamp : Int;
    segments : [TrafficSegment];
    weather : WeatherData;
    activeAnomalies : [Anomaly];
    activeEmergencies : [EmergencyAlert];
    systemHealth : Nat;
  };
};
