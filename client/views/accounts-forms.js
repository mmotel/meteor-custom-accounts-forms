var onValid = function () {
  $(this).parent().removeClass('has-error');
  $(this).parent().addClass('has-success'); 
}

var onNotValid = function ( errType ) {
  if(errType.empty){ return; }
  $(this).parent().addClass('has-error');
}

var validLoginForm = function () { 
  $().valid("form", {
    "fields": 
      [
        { "field": "#login-email", "type": "email", "options": { "onValid": onValid, "onNotValid": onNotValid } },
        { "field": "#login-password", "type": "password", "options":             
          {"size": { "min": 8, "max": 32 }, "content": { "small": true, "big": true, "digit": true, "special": false }, 
            "onValid": onValid, "onNotValid": onNotValid } 
        }
      ],
      "onFormValid": function () {
        $('#login-btn').removeAttr("disabled");
        // console.log("valid");
      },
      "onFormNotValid": function () {
        $('#login-btn').attr("disabled", "disabled");
        // console.log("not valid");
      }
  });

}

var onValid2 = function () {
  $(this).parent().removeClass('has-error');
  $(this).parent().addClass('has-success');
  $( '#' + $(this).attr('id') + '-error').slideUp(); 
}

var onNotValid2 = function ( errType ) {
  if(errType.empty){ return; }
  $(this).parent().addClass('has-error');
  $( '#' + $(this).attr('id') + '-error').slideDown();
}

var validCreateAccountForm = function () { 
  $().valid("form", {
    "fields": 
      [
        { "field": "#signin-email", "type": "email", "options": { "onValid": onValid2, "onNotValid": onNotValid2 } },
        { 
          "field": "#signin-password", "type": "password","options": 
            { "size": { "min": 8, "max": 32 }, "content": { "small": true, "big": true, "digit": true, "special": false }, 
            "onValid": onValid2, "onNotValid": onNotValid2 } 
        },
        { 
          "field": "#signin-password-repeat", "type": "password", "options": 
            { "size": { "min": 8, "max": 32 }, "content": { "small": true, "big": true, "digit": true, "special": false }, 
            "onValid": function () {
              if( $('#signin-password').val() === $('#signin-password-repeat').val() ){
                onValid2.call(this);
              }
              else {
                onNotValid2.call(this, {});
              }
            }, 
            "onNotValid": onNotValid2 
          } 
        }
      ],
      "onFormValid": function () {
        if( $('#signin-password').val() === $('#signin-password-repeat').val() ){
          onValid2.call($('#signin-password-repeat'));
          $('#create-acconut-btn').removeAttr("disabled");
        }
        else {
          onNotValid2.call($('#signin-password-repeat'), {});
          $('#create-acconut-btn').attr("disabled", "disabled");
        }        
        console.log("valid");
      },
      "onFormNotValid": function () {
        $('#create-acconut-btn').attr("disabled", "disabled");
        console.log("not valid");
      }
  });

}


Template.loginForm.rendered = function () {
  $("#login-error").hide();
  validLoginForm();
}

Template.loginForm.events({
  "submit #loginForm": function(event, template) {
    event.preventDefault();
    var email = template.find("#login-email").value;
    var password = template.find("#login-password").value;

    Meteor.loginWithPassword(
      email,
      password,
      function(error) {
        if (error) {
          $("#login-email").parent().addClass('has-error');
          $("#login-password").parent().addClass('has-error');
          $('#login-error').slideDown();
          validLoginForm();
        } else {
          $("#login-email").parent().removeClass('has-error');
          $("#login-email").parent().removeClass('has-success');
          $("#login-password").parent().removeClass('has-error');
          $("#login-password").parent().removeClass('has-success');
          $("#login-error").slideUp();
        }
      }
    );
  },
  'click #showCreateAccountFormBtn': function () {
    $('#loginFormBox').hide();
    $('#createAccountFormBox').show();
    validCreateAccountForm();
  },
  //validation
  'keyup #login-email, blur #login-email': function (event, template) {
    validLoginForm();
  },
  'keyup #login-password, blur #login-password': function (event, template) {
    validLoginForm();
  }
  //---
});

Template.createAccountForm.rendered = function () {
  validCreateAccountForm();
}

Template.createAccountForm.events({
  'click #showLoginFormBtn': function () {
      $('#createAccountFormBox').hide();
      $('#loginFormBox').show();
      validLoginForm();
  },
  //validation
  'keyup #signin-email, blur #signin-email': function (event, template) {
    var email = template.find('#signin-email').value;
    validCreateAccountForm();
  },
  'keyup #signin-password, blur #signin-password': function (event, template) {
    validCreateAccountForm();
  },
  'keyup #signin-password-repeat, blur #signin-password-repeat': function (event, template) {
    validCreateAccountForm();
  },
  //---
  'submit #createAccountForm': function (event, template) {
    event.preventDefault();
    var email = template.find('#signin-email').value;
    var password = template.find('#signin-password').value;
    var repeatPassword = template.find('#signin-password-repeat').value;

    Accounts.createUser(
      {
        "email": email,
        "password": password,
        "profile": {
          "name": email
        }
      },
      function(error) {
        if (error) {
        } else {
          $('#createAccountFormBox').hide();
          $('#loginFormBox').show();
        }
      }
    );    

  }
});

Template.accountPanel.events({
  'click #logoutBtn': function () {
    Meteor.logout(function(error) {
      if (error) {
          // Display the logout error to the user however you want
      }
      else {
        $('#createAccountFormBox').hide();
        $('#loginFormBox').show();
      }
    });
  }
});

Template.accountPanel.user = function (){
  var name = '';
  if(Meteor.user() && Meteor.user().emails){
    name = Meteor.user().emails[0].address;
  }
  return {"name": name };
}
