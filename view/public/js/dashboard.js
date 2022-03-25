$(document).ready(function(){
  $.ajax({
    url: '/user',
    type: 'GET',
    contentType: 'application/json',
    success: function(response){
        $("#username").text("Welcome " + response.username + "!");
    },        
    error: function(xhr, status, error){
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Error - ' + errorMessage);
    }
});

$.ajax({
    url: '/user/workoutprograms',
    type: 'GET',
    contentType: 'application/json',
    success: function(response){
        response.forEach(element => {
            $('#workout-programs').append('<div>',element.nameOfProgram,'</div>');
        });
    },        
    error: function(xhr, status, error){
        var errorMessage = xhr.status + ': ' + xhr.statusText
        alert('Error - ' + errorMessage);
    }
});

});