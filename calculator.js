/* Calculator JavaScript */

/* adapt these settings if needed */
var ScriptSettings = { 
   DebugOutputEnabled: false,
   InitialTheme: "theme_two"
};

/* internal variables */
var ThemeNameList = "theme_one theme_two";
var leftNumberForCalc = 0;
var isCalculationFinished = false;
var calcFunction = calcFuncDummy;
var isCalcSignInDisplay = false;

$(document).ready(function() {
   /* animate buttons when mouse enters/leaves and when the button is clicked */
   $(".button")
      .hover(
         function() {
            $(this).addClass("highlighted");
         },
         function() {
            $(this).removeClass("highlighted");
         })
      .mousedown(function() {
         $(this).addClass("pressed");
      })
      .mouseup(function() {
         $(this).removeClass("pressed");
      })
      .click(function() {
         var buttonValue = $(this).data("keyvalue");
         processButtonClick(buttonValue);
      });
   /* handle change of color-theme */
   $("#colorselector").change(function() {
      var themeClass = $(this).val();
      setTheme(themeClass);
   });
   /* make the calculator draggable */
   $("#calculator").draggable();

   /* check if a theme was given as url-param */
   var QueryParams = getQueryParams();
   if(QueryParams.theme) {
      ScriptSettings.InitialTheme = QueryParams.theme;
   }
   /* set initial theme */
   setTheme(ScriptSettings.InitialTheme);
   
   $("#memselector").change(function() {
      var memValue = $(this).val();
      $("#display").text(memValue);
   });
   
   $(document).on('keypress', handleKeyPress);
   $(document).on('keyup', handleKeyUp);
});

/* store all params/values given in URL to an object and return it (found here: http://stackoverflow.com/a/979995) */
function getQueryParams() {
   var decodedUrlArgs = {};
   var plainUrlArgsString = window.location.search.substring(1);
   var urlArgsArr = plainUrlArgsString.split("&");
   for(var i = 0; i < urlArgsArr.length; i++) {
      var keyValuePair = urlArgsArr[i].split("=");
      decodedUrlArgs[keyValuePair[0]] = decodeURIComponent(keyValuePair[1]);
   } 
   return decodedUrlArgs;
}

/* activate theme and set selection in theme-selector (needed if theme was given in url) */
function setTheme(themeName) {
   /* check if given theme name is in list of available theme-names */
   if(ThemeNameList.indexOf(themeName) != -1) {
      $("#colorselector").val(themeName);
      $("body").removeClass(ThemeNameList).addClass(themeName);
   }
}

/* if output is enabled write the message to the console */
function consoleOut(msg) {
   if(ScriptSettings.DebugOutputEnabled) {
      console.log(msg);
   }
}

function handleKeyPress(event) {
   /*  *  +  ,  -  .  /  0  9  c  C  m   M  = 
       42 43 44 45 46 47 48 57 99 67 109 77 61 13  */
   var validCode =       [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 99, 67, 109,77, 61, 13];
   var codeTranslation = ["*","+",".","-",".","/","0","1","2","3","4","5","6","7","8","9","C","C","M","M","=","="];
   var codeIdx = validCode.indexOf(event.which);
   if(codeIdx >= 0) {
      //$("table").find("[data-keyvalue='" + codeTranslation[codeIdx] + "']").trigger("mouseenter").delay(500).trigger("mouseleave").click();
      processButtonClick(codeTranslation[codeIdx]);
   }
}

function handleKeyUp(event) {
   if(event.which == 46) {
      //$("table").find("[data-keyvalue='" + "C" + "']").trigger("mouseenter").delay(500).trigger("mouseleave").click();
      processButtonClick("C");
   }
}

/* process the click-event for all buttons */
function processButtonClick(buttonValue) {
   switch(buttonValue) {
      case "+":
         addTo();
         isCalcSignInDisplay = true;
         break;
      case "-": 
         subFrom();
         isCalcSignInDisplay = true;
         break;
      case "*": 
         multWith();
         isCalcSignInDisplay = true;
         break;
      case "/": 
         diffBy();
         isCalcSignInDisplay = true;
         break;
      case "=": 
         equalsTo(true);
         isCalcSignInDisplay = false;
         break;
      case "C": 
         clearCalc();
         isCalcSignInDisplay = false;
         break;
      case "M": 
         storeValue();
         isCalcSignInDisplay = false;
         break;
      default:
         addDigit(buttonValue);
         isCalcSignInDisplay = false;
         break;
   }
}

/* store current value to memory-list */
function storeValue() {
   var strVal = "0";
   if(isCalcSignInDisplay) {
      strVal = formatOutputNumber(leftNumberForCalc);
   } else {
      strVal = $("#display").text();
   }
   $("#memselector").prepend("<option value=\"" + strVal + "\">" + strVal + "</option>");
}

/* execute the calculation */
function equalsTo(resetMem, displayVal) {
   var displayValue = $("#display").text();
   leftNumberForCalc = calcFunction(leftNumberForCalc, getNumberFromString(displayValue));
   if(displayVal) {
      $("#display").text(displayVal);
   } else {
      $("#display").text(formatOutputNumber(leftNumberForCalc));
   }
   isCalculationFinished = true;
   if(resetMem) {
      calcFunction = calcFuncDummy;
   }
}

/* round numbers to get 'nice' output ("1.3" instead of "1.2999999999" etc.) */
function formatOutputNumber(theNumber) {
   var num = parseFloat(theNumber.toFixed(10));
   var out = num.toString();
   consoleOut("formatOutputNumber: " + theNumber + " -> " + num + " -> " + out);
   return out;
}

/* convert string to number */
function getNumberFromString(stringVal) {
   var floatVal = parseFloat(stringVal);
   if(isNaN(floatVal) || floatVal == "" || floatVal == null) {
      floatVal = 0;
   }
   consoleOut("getNumberFromString: " + stringVal + " -> " + floatVal);
   return floatVal;
}

function addTo() {
   equalsTo(false, "+");
   calcFunction = calcFuncAdd;
}

function subFrom() {
   equalsTo(false, "-");
   calcFunction = calcFuncSub;
}

function multWith() {
   equalsTo(false, "*");
   calcFunction = calcFuncMult;
}

function diffBy() {
   equalsTo(false, "/");
   calcFunction = calcFuncDiff;
}

/* calculation functions */
function calcFuncAdd(leftNumber, rightNumber) {
   var res = leftNumber + rightNumber;
   consoleOut("calcFuncAdd: "+leftNumber+" + "+rightNumber+" = "+res);
   return res;
}

function calcFuncSub(leftNumber, rightNumber) {
   var res = leftNumber - rightNumber;
   consoleOut("calcFuncSub: "+leftNumber+" - "+rightNumber+" = "+res);
   return res;
}

function calcFuncMult(leftNumber, rightNumber) {
   var res = leftNumber * rightNumber;
   consoleOut("calcFuncMult: "+leftNumber+" * "+rightNumber+" = "+res);
   return res;
}

function calcFuncDiff(leftNumber, rightNumber) {
   var res = leftNumber / rightNumber;
   consoleOut("calcFuncMult: "+leftNumber+" / "+rightNumber+" = "+res);
   return res;
}

function calcFuncDummy(leftNumber, rightNumber) {
   var res = rightNumber;
   consoleOut("calcFuncDummy: "+res);
   return res;
}

/* clear calculation store */
function clearCalc() {
   $("#display").text("0");
   leftNumberForCalc = 0;
   calcFunction = calcFuncDummy;
}

/* add a typed digit or sign to the display */
function addDigit(theDigit) {
   clearTextSelection();
   var displayValue = $("#display").text();
   if(theDigit == ".") {
      if(displayValue.indexOf(".") == -1 && ! isCalculationFinished) {
         $("#display").append(theDigit);
      } else {
         $("#display").text("0"+theDigit);
      }
   } else {
      if(displayValue == "0" || isCalculationFinished) {
         $("#display").text(theDigit);
      } else {
         $("#display").append(theDigit);
      }
   }
   isCalculationFinished = false;
}

function clearTextSelection() {
   /* source: http://stackoverflow.com/a/3169849 */
   if (window.getSelection) {
     if (window.getSelection().empty) {  // Chrome
       window.getSelection().empty();
     } else if (window.getSelection().removeAllRanges) {  // Firefox
       window.getSelection().removeAllRanges();
     }
   } else if (document.selection) {  // IE?
     document.selection.empty();
   }
}
