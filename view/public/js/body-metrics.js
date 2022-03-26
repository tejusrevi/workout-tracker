function updateBMI(height, weight) {
  // https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/healthy-weights/canadian-guidelines-body-weight-classification-adults/body-mass-index-nomogram.html
  let bmi = Math.round( (weight / (height/100 * height/100)) * 100) / 100;
  $("#bmi-number").text(bmi);
  if (bmi < 18.5){
    $("#bmi-text").text("Your BMI classification is underweight");
  }else if (bmi < 18.5 && bmi < 24.9){
    $("#bmi-text").text("Your BMI classification is normal weight");
  }else if (bmi >25.0){
    $("#bmi-text").text("Your BMI classification is overweight");
  }
}

function updateGoal(weight, goalWeight) {
  let diff = goalWeight - weight;

  $("#goal-number").text(Math.abs(diff) + " kgs");

  if (diff < 0){
    $("#goal-text").text('over');
  }else {
    $("#goal-text").text('under');
  }
}

function updateMetrics() {
  $.ajax({
    url: "/user",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      $("#age").text(response.personalInfo.age);
      $("#gender").text(response.personalInfo.gender).change();
      $("#height").text(response.personalInfo.height);
      $("#weight").text(response.personalInfo.weight);
      $("#goal-weight").text(response.personalInfo.goalWeight);
      updateBMI(response.personalInfo.height, response.personalInfo.weight)
      updateGoal(response.personalInfo.weight, response.personalInfo.goalWeight)
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
}

$(document).ready(function () {
  updateMetrics();
});

$("#edit-body-metrics-button").click(function (event) {
  event.preventDefault();
  $("#body-metrics-alert-success").hide();
  $("#body-metrics-alert-danger").hide();
  $("#view-body-metrics").hide();
  $("#edit-body-metrics").show();

  $.ajax({
    url: "/user",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      $("#age-input").val(response.personalInfo.age);
      $("#gender-input").val(response.personalInfo.gender).change();
      $("#height-input").val(response.personalInfo.height);
      $("#weight-input").val(response.personalInfo.weight);
      $("#goal-weight-input").val(response.personalInfo.goalWeight);

      updateBMI(response.personalInfo.height, response.personalInfo.weight)
      updateGoal(response.personalInfo.weight, response.personalInfo.goalWeight)
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
});

$("#save-body-metrics-button").click(function (event) {
  event.preventDefault();
  $("#body-metrics-alert-success").hide();
  $("#body-metrics-alert-danger").hide();
  $("#view-body-metrics").show();
  $("#edit-body-metrics").hide();

  let bodyMetrics = {};

  bodyMetrics.age = $("#age-input").val();
  bodyMetrics.gender = $("#gender-input").val();
  bodyMetrics.height = $("#height-input").val();
  bodyMetrics.weight = $("#weight-input").val();
  bodyMetrics.goalWeight = $("#goal-weight-input").val();

  console.log(bodyMetrics);
  $.ajax({
    url: "/user/personalInformation",
    type: "PUT",
    data: JSON.stringify(bodyMetrics),
    contentType: "application/json",
    success: function (response) {
      updateMetrics();
      $("#body-metrics-alert-success").text("Your information was updated");
      $("#body-metrics-alert-success").show();
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
});
