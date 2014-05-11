/*
  Version: 0.1.0 BETA
  Release date: 05.05.2014
  Copyright (c) Mateusz Motel 
*/

(function( $ ){
  "use strict";

  var valid = {
    "text": function (that, options) {
      var value = $(that).val();
      var err = false;
      var errType = {};
      // //console.log($(that).val());

      if(value.length === 0){
        errType.empty = true;
      }

      if(options.size){
        if(options.size.min){
          if(value.length < options.size.min){
            // //console.log("size.min err");
            err = true;
            if(!errType.size){ errType.size = {}; }
            errType.size.min = true;
          }
        }
        if(options.size.max){
          if(value.length > options.size.max){
            // //console.log("size.max err");
            err = true;
            if(!errType.size){ errType.size = {}; }
            errType.size.max = true;
          }
        }
      }
      if(options.regexp && options.regexp.pat){
        var patt;
        if(options.regexp.mod){
          patt = new RegExp(options.regexp.pat, options.regexp.mod);
        } else{
          patt = new RegExp(options.regexp.pat);
        }
        // //console.log(patt);
        // //console.log(patt.test(value));
        if(!patt.test(value)){
          // //console.log("regexp err");
          err = true;
          errType.regexp = true;
        }
      }
      //console.log(err);
      
      // console.log(errType);

      return { "valid": !err, "errType": errType };
    },
    "number": function (that, options) {
      var value = parseFloat($(that).val());
      var err = false;
      var errType = {};
      // //console.log($(that).val());

      if($(that).val().length === 0){
        errType.empty = true;
      }

      if( !isNaN(value) ){
        if(options.value && options.value.min){
          if(value < options.value.min){
            //console.log("value.min err");
            err = true;
            if(!errType.value){ errType.value = {}; }
            errType.value.min = true;
          }
        }
        if(options.value && options.value.max){
          if(value > options.value.max){
            //console.log("value.max err");
            err = true;
            if(!errType.value){ errType.value = {}; }
            errType.value.max = true;            
          }
        }
        if(options.type){
          if(options.type === "Int"){
            if(value % 1 !== 0){
              //console.log("type.Int err");
              err = true;
              errType.type = true;
            }
          } //else if(options.type === "Float"){
            // ?
          //}
        }
      }
      else {
        err = true;
      }
      //console.log(err);

      return { "valid": !err, "errType": errType };
    },
    "email": function (that, options) {
      var settings = $.extend(
        {
          "size": 
          { 
            "min": 5, 
            "max": 64 
          }, 
        "regexp": 
          {
            "pat": "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\." +
         "[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@" +
         "(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+" +
         "[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
          }
        }, 
        options);

      return valid.text(that, settings);
    },
    "password": function (that, options) {
      var value = $(that).val();
      var err = false;
      var errType = {};
      // //console.log($(that).val());

      var settings = $.extend({
        "size":
        {
          "min": 8
        }, 
        "content":
        {
          "small": true, 
          "big": true,
          "digit": true,
          "special": false
        }
      }, options);

      if(value.length === 0){
        errType.empty = true;
      }
      var validSize = valid.text(that, { "size": settings.size });
      if(! validSize.valid){
        //console.log("size err");
        err = true;
        errType.size = {};
        if(validSize.errType.size.min){ errType.size.min = true; }
        else if(validSize.errType.size.max){ errType.size.max = true; }
      }

      if(settings.content){
        if(settings.content.small){
          if(! valid.text(that, { "regexp": { "pat": "[a-z]" } }).valid){
            //console.log("content.small err");
            err = true;
            if(! errType.content){ errType.content = {}; }
            errType.content.small = true;
          }        
        }
        if(settings.content.big){
          if(! valid.text(that, { "regexp": { "pat": "[A-Z]" } }).valid){
            //console.log("content.big err");
            err = true;
            if(! errType.content){ errType.content = {}; }
            errType.content.big = true;
          }         
        }
        if(settings.content.digit){
          if(! valid.text(that, { "regexp": { "pat": "\\d" } }).valid){
            //console.log("content.digit err");
            err = true;
            if(! errType.content){ errType.content = {}; }
            errType.content.digit = true;
          }         
        }
        if(settings.content.special){
          if(! valid.text(that, { "regexp": { "pat": "[\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)\\_\\+\\-\\=]" } }).valid){
            //console.log("content.special err");
            err = true;
            if(! errType.content){ errType.content = {}; }
            errType.content.special = true;
          }        
        }

      }
      //console.log(err);
      
      return { "valid": !err, "errType": errType };
    },
    "fields": function (that) {
      var err = false;
      //console.log(that);

      $(that.field).each(function () { 
        var isValid = valid[ that.type ](this, that.options);

        if(!isValid.valid){
          that.options.onNotValid.call(this, isValid.errType);
          err = true;
        }
        else {
          that.options.onValid.call(this, isValid.errType);
        }

      });

      return !err;
    }
  }

  var methods = {
    'init': function ( options ) {
      console.log("Usage: $(selector).valid(type, options)");
      console.log("Go to http://github.com/mmotel/jquery-plugin-validation/ for more details.");

      return this;
    },
    'field': function ( method, options ) {
      //console.log(options);

      return this.each(function () {
        var isValid = valid[ method ](this, options);

        if(isValid.valid){
          options.onValid.call(this, isValid.errType);
        } 
        else {
          options.onNotValid.call(this, isValid.errType);
        }
      });
    },
    'form': function ( options ) {
      //console.log(options);
      var err = false;

      options.fields.forEach(function( that, id ) {
        var isValid = valid.fields(that);

        if(! isValid){
          err = true;
        } 
      });

      if(err){
        options.onFormNotValid.call(this);
      } else {
        options.onFormValid.call(this);
      }

      return this;
    }
  };
  
  $.fn.valid = function ( method ) {
    if( valid[ method ] && method !== "fields" ) {
      return methods.field.apply( this, arguments );
    }
    else if( methods[ method ] && method !== "field" ){
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
    }
    else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    }
    else {
      $.error('Method ' + method + ' does not exists in jQuery.valid');
    }
  };

})( jQuery );
