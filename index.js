//#region variables
var gis = require('g-i-s');
//temp reply object , for searching image function
var tempReply;
//#endregion
//#region constants
const 
const imgSearchMessage = 'دنبال عکس چی میگردی؟ ';
const mainMenuMessage = 'از منوی زیر یه گزینه انتخاب کن.';
const mainMenu = 'منوی اصلی';
const occurenceError = 'خطایی رخ داده !!';
//the tag in which we want to fetch our results with 
const tag = 'url';
const imageSearch = 'جستجوی عکس'; 
//#endregion
//#region keyboards
var mainKeyboard = [
  [ '/'+imageSearch ],
];
var imgSearchKeyboard = [
  ['/'+ mainMenu ],
];
//#endregion
//#region botCommands
bot.command(mainMenu,start, function (msg, reply, next) {
    showMainMenu(msg,reply);
});

bot.command(imageSearch, function (msg, reply, next) {
    showImgSearch(msg,reply);
});

//#endregion
function onMessage(msg, reply) {
  switch (currentState) {
    case mainMenu:
    {
        showMainMenu(msg,reply);
        break;
    }
    case imgSearchState:
    {
        searchForImages(msg.text,reply);
        break;
    }
    default:
    {
        showMainMenu(msg,reply);
        break;
    } 
    }
  }
  
//#region methods
function showMainMenu(msg,reply) {
  currentState = mainMenu;
  reply.keyboard(mainKeyboard, true).text(mainMenuMessage);
}


function searchForImages(query,reply) {
  tempReply  = reply;
  gis(query.text, replySearchResults);
}

function showImgSearch(msg,reply) {
  currentState = imageSearch;
  reply.keyboard(imgSearchKeyboard, true).text(imgSearchMessage);

}
//if any element name matches with passedTag , reply the result to user 
function replyOccurences(x, passedTag){
  for(var i = 0; i < x.length; i++) {
      if (x[i][passedTag]){
        try {
          tempReply.html('<a href="url">'+x[i][passedTag]+'</a>');
        }
      catch(err) {
          reply.markdown(occurenceError);
      }
      }
  }
  return -1; //This means no match found
}


  function replySearchResults(error, results) {
  if (error) {
    console.log(error);
  }
  else {
    //reply to user , any element marked tag
    replyOccurences(results,tag);
  }
}
//#endregion
