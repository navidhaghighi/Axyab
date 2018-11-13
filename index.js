//#region variables
var searchCountLimit =10;
var currentState ;
var gis = require('g-i-s');
//temp reply object , for searching image function
var tempReply;
//#endregion
//#region constants
const limitationChanged = 'محدودیت جستجو تغییر کرد.😎'
const notNumberError = 'عدد وارد کن  😐';
const changeLimitaionMsg = 'میخوای جستجوت به چند تا نتیجه محدود باشه ؟ 🤔'+
'یا از منوی پایین انتخاب کن , یا تایپ کن.🤗 '
const changeSearchLimitation = 'تغییر محدودیت جستجو 📝'
const searchEndedMsg = 'جستجو تموم شد.😋';
const invalidCmd = 'دستور شناخته نشد !!😕	';
const start = 'شروع🚐';
const Botgram = require('botgram');
const { TELEGRAM_BOT_TOKEN } = process.env;
const bot = new Botgram(TELEGRAM_BOT_TOKEN);
const imgSearchMessage = 'دنبال عکس چی میگردی؟ 😉';
const mainMenuMessage = 'از منوی زیر یه گزینه انتخاب کن.🙂';
const mainMenu = 'منوی اصلی🏠';
const occurenceError = 'خطایی رخ داده !!😞';
//the tag in which we want to fetch our results with 
const tag = 'url';
const imageSearch = 'جستجوی عکس🌄'; 
//#endregion
//#region keyboards
var mainKeyboard = [
  [ imageSearch ],
];


var imgSearchKeyboard = [
  [ mainMenu, changeSearchLimitation ],
];


var changeLimitiationKeyboard = [
  [ '1', '2', '5', '10' ],
  [ '20', '30', '40', '50' ],
  [ mainMenu ],
];
//#endregion
//#region botCommands
bot.command('start',function (msg, reply, next) {
  showMainMenu(msg,reply);
});


bot.command(function (msg, reply, next) {
  reply.text(invalidCmd);
});

//#endregion
function onMessage(msg, reply) {
  switch (msg.text) {
    case mainMenu:
    {
      showMainMenu(msg,reply);
      return;
    }  
    case start:
    {
      showMainMenu(msg,reply);
      return;
    }
      
    case imageSearch:
    {
      showImgSearch(msg,reply);
      return;
    }

    case changeSearchLimitation:
    {
      showChangeLimitationMenu(reply);
      return;
    }
      
    default:
      break;
  }
  switch (currentState) {
    case mainMenu:
    {
        showMainMenu(msg,reply);
        break;
    }
    case imageSearch:
    {
        searchForImages(msg.text,reply);
        break;
    }
    case changeSearchLimitation:
    {
      changeSearchLimitationTo(reply,msg.text);
      break;
    }
    default:
    {
        showMainMenu(msg,reply);
        break;
    } 
    }
  }
  bot.text(onMessage);
  
//#region methods
function showMainMenu(msg,reply) {
  currentState = mainMenu;
  reply.keyboard(mainKeyboard, true).text(mainMenuMessage);
}


function changeSearchLimitationTo(reply,newLimitaion) {
  try {
   var newInt =  parseInt(newLimitaion,10);
  } catch (error) {
    reply.markdown(notNumberError);
  }
  searchCountLimit = newInt;
  reply.keyboard().text (limitationChanged);
  showImgSearch('',reply);
  
}


function showChangeLimitationMenu(reply) {
  currentState = changeSearchLimitation;
  reply.keyboard(changeLimitiationKeyboard, true).text(changeLimitaionMsg);

}

function searchForImages(query,reply) {
  tempReply  = reply;
  gis(query, replySearchResults);
}

function showImgSearch(msg,reply) {
  currentState = imageSearch;
  reply.keyboard(imgSearchKeyboard, true).text(imgSearchMessage);

}
//if any element name matches with passedTag , reply the result to user 
function replyOccurences(x, passedTag){
  var searchCount =0;
  for(var i = 0; i < x.length; i++) {
      if (x[i][passedTag]){
        try {
          if(searchCount>=searchCountLimit)
            break;
          tempReply.html('<a href="url">'+x[i][passedTag]+'</a>');
          searchCount++;
        }
      catch(err) {
          tempReply.markdown(occurenceError);
      }
      }
  }
  tempReply.markdown(searchEndedMsg);
  tempReply.markdown('این جستجو محدود بود و فقط '+ searchCountLimit
  + 'تا عکس تونستی پیدا کنی😟' + '\n'+
   'میتونی این محدودیت رو از منو تغییر بدی. 😊');
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
