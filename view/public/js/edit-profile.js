$(document).ready(function(){
  $.ajax({
    url: '/user',
    type: 'GET',
    contentType: 'application/json',
    success: function(response){
        $("#username-input").val(response.username);
    },        
    error: function(xhr, status, error){
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Error - ' + errorMessage);
    }
});

});

function assembleProfile(){
  let c = {};
  c.username = $("#username-input").val();
  c.password = $("#password-input").val();
  c.age = $("#age-input").val();
  c.gender = $("#gender-input").val();
  c.height = $("#height-input").val();
  c.weight = $("#weight-input").val();
  c.goalWeight = $("#goal-weight-input").val();
  return c;
}

$("#submit-profile").click(function(event){
  event.preventDefault();
  let newProfile = assembleProfile();
  console.log(newProfile)
  $.ajax({
      url: '/user/personalInformation',
      type: 'PUT',
      data: JSON.stringify(newProfile),
      contentType: 'application/json',                        
      success: function(response){
          console.log(response);                
      },                   
      error: function(xhr, status, error){
          var errorMessage = xhr.status + ': ' + xhr.statusText
          alert('Error - ' + errorMessage);
      }
  });
});