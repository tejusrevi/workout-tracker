function assembleProfile() {
  let c = {};
  c.nameOfProgram = $("#program-name-input").val();
  if ($("#ispublic-input").is(":checked")) {
    c.isPublic = "1";
  } else {
    c.isPublic = "0";
  }
  return c;
}

$("#submit-program").click(function (event) {
  event.preventDefault();
  let newProgram = assembleProfile();
  console.log(newProgram);
  $.ajax({
    url: "/workoutProgram",
    type: "POST",
    data: JSON.stringify(newProgram),
    contentType: "application/json",
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
});
