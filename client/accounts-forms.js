var validateEmail = function (email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


Template.loginForm.rendered = function () {
  $("#loginError").hide();
}

Template.loginForm.events({
  "submit #loginForm": function(event, template) {
    event.preventDefault();
    var email = template.find("#login-email").value;
    var password = template.find("#login-password").value;

    if( validateEmail(email) && password.length >= 6 ) {

      Meteor.loginWithPassword(
        email,
        password,
        function(error) {
          if (error) {
            $("#login-email").parent().addClass('has-error');
            $("#login-password").parent().addClass('has-error');
            $('#loginError').slideDown();
          } else {
            $("#login-email").parent().removeClass('has-error');
            $("#login-email").parent().removeClass('has-success');
            $("#login-password").parent().removeClass('has-error');
            $("#login-password").parent().removeClass('has-success');
            $("#loginError").slideUp();
          }
        }
      );

    } else {
      $('#loginError').slideDown();
    }
  },
  'click #showCreateAccountFormBtn': function () {
    Session.set('LOGINshowCreateAccountForm', true);
  },
  //validation
  'keyup #login-email': function (event, template) {
    var email = template.find('#login-email').value;
    if( !(validateEmail(email)) ){
      $("#login-email").parent().addClass('has-error');
    } 
    else {
      $("#login-email").parent().removeClass('has-error');
      $("#login-email").parent().addClass('has-success'); 
    }
  },
  'keyup #login-password': function (event, template) {
    var password = template.find('#login-password').value;
    if(! (password.length >= 6) ) {
      $("#login-password").parent().addClass('has-error');
    } 
    else {
      $("#login-password").parent().removeClass('has-error');
      $("#login-password").parent().addClass('has-success'); 
    }
  }
  //---
});

Template.loginForm.show = function () {
  return !( Session.get('LOGINshowCreateAccountForm') );
}

Template.createAccountForm.rendered = function () {
  $('#signinEmailError').hide();
  $('#signinPasswordError').hide();
  $('#signinPasswordRepeatError').hide();
}

Template.createAccountForm.events({
  'click #showLoginFormBtn': function () {
      Session.set('LOGINshowCreateAccountForm', false);
      Session.set('SIGNINemailError', false);
      Session.set('SIGNINpasswordError', false);
      Session.set('SIGNINpasswordRepeatError', false);
  },
  //validation
  'keyup #signin-email': function (event, template) {
    var email = template.find('#signin-email').value;
    if( !(validateEmail(email)) ) {
      $("#signin-email").parent().addClass('has-error');
      $('#signinEmailError').slideDown();
    } 
    else {
      $("#signin-email").parent().removeClass('has-error');
      $("#signin-email").parent().addClass('has-success');  
      $('#signinEmailError').slideUp();
    }
  },
  'keyup #signin-password': function (event, template) {
    var password = template.find('#signin-password').value;
    if(! (password.length >= 6) ) {
      $("#signin-password").parent().addClass('has-error');
      $('#signinPasswordError').slideDown();
    } 
    else {
      $("#signin-password").parent().removeClass('has-error');
      $("#signin-password").parent().addClass('has-success'); 
      $('#signinPasswordError').slideUp();
    }
  },
  'keyup #signin-password-repeat': function (event, template) {
    var password = template.find('#signin-password').value;
    var repeatPassword = template.find('#signin-password-repeat').value;
    if( password !== repeatPassword ) {
      $("#signin-password-repeat").parent().addClass('has-error');
      $('#signinPasswordRepeatError').slideDown();
    } 
    else {
      $("#signin-password-repeat").parent().removeClass('has-error');
      $("#signin-password-repeat").parent().addClass('has-success'); 
      $('#signinPasswordRepeatError').slideUp();
    }
  },
  //---
  'submit #createAccountForm': function (event, template) {
    event.preventDefault();
    var email = template.find('#signin-email').value;
    var password = template.find('#signin-password').value;
    var repeatPassword = template.find('#signin-password-repeat').value;

    if( validateEmail(email) && password === repeatPassword && password.length >= 6 && repeatPassword.length >= 6 ){
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
            Session.set('LOGINshowCreateAccountForm', false);
          }
        }
      );    
    }

  }
});

Template.createAccountForm.show = function () {
  return Session.get('LOGINshowCreateAccountForm');
}

Template.accountPanel.events({
  'click #logoutBtn': function () {
    Meteor.logout(function(error) {
      if (error) {
          // Display the logout error to the user however you want
      }
      else {
        Session.set('LOGINshowCreateAccountForm', false);
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
