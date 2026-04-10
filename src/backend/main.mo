import Types "types/common";
import TrafficSim "lib/TrafficSim";
import TrafficAPI "mixins/traffic-api";
import List "mo:core/List";
import Time "mo:core/Time";

actor {
  // -----------------------------------------------------------------------
  // State
  // -----------------------------------------------------------------------

  let segments : List.List<Types.TrafficSegment> = List.fromArray(TrafficSim.initialSegments());
  let anomalies : List.List<Types.Anomaly> = List.empty();
  let routes : List.List<Types.Route> = List.fromArray(TrafficSim.initialRoutes());
  let incidents : List.List<Types.Incident> = List.empty();
  let weather : { var data : Types.WeatherData } = {
    var data = {
      condition = #Clear;
      temperature = 20.0;
      visibility = 10000;
      windSpeed = 10.0;
      updatedAt = Time.now();
      affectedDistricts = ["Downtown Core", "Westside Business District", "Eastside Residential", "North Industrial Zone"];
      recommendation = "All routes nominal. No weather-related restrictions.";
    };
  };
  let components : List.List<Types.SystemComponent> = List.fromArray(TrafficSim.initialComponents());
  let emergencies : List.List<Types.EmergencyAlert> = List.empty();
  let counters : { var incidentCounter : Nat; var tickCounter : Nat } = {
    var incidentCounter = 0;
    var tickCounter = 0;
  };

  // -----------------------------------------------------------------------
  // Mixin composition
  // -----------------------------------------------------------------------

  include TrafficAPI(segments, anomalies, routes, incidents, weather, components, emergencies, counters);
};
