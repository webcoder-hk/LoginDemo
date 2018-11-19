/**************************
 * Author: Xue Tao
 * Date:   2018-11-17
 * Mail:   mail2xt@163.com
 **************************/
 
function $() {
    if (arguments.length==1) {
        return document.getElementById(arguments[0]);
    }
    var args = new Array();
    for (var i=0; i<arguments.length; i++) {
        var arg = arguments[i];
        args.push(document.getElementById(arg));
    }
    return args;
}
 
function setCookie(data) {
    var date = new Date();
    date.setMonth(date.getMonth()+1);
    var str = '';
    for (var k in data) {
        document.cookie = k+'='+escape(data[k]);
    }
    document.cookie = 'expires='+date.toUTCString();
}

function getCookie(name) {
    var aCookies = document.cookie.split(";");
    for (var i=0; i<aCookies.length; i++) {
        var aPair = aCookies[i].split("=");
        if (name==aPair[0].trim()) return unescape(aPair[1]);
    }
}

function delCookie(name) {
    document.cookie = name+"=;expires=Fri, 31 Dec 1999 00:00:00 GMT;";
}

function getFormData() {
    var dataStr = '';
    var elements = $('loginForm').elements;
    for (var i=0; i<elements.length; i++) {
        if (elements[i].name && elements[i].type!='radio') {
            dataStr += '&'+elements[i].name+'='+elements[i].value;
        } else if(elements[i].name && elements[i].type=='radio') {
            dataStr += '&'+elements[i].name+'='+elements[i].checked;
        }
    }
    dataStr = dataStr.substr(1);
    return dataStr;
}

function createXHR() {
    var xmlHttp = null;
    if (!window.ActiveXObject && window.XMLHttpRequest)
    {
        xmlHttp = new XMLHttpRequest();
    }
    else if (!window.XMLHttpRequest && window.ActiveXObject)
    {
        xmlHttp = new ActiveXObject(
            (navigator.userAgent.toLowerCase().indexOf('msie 5')!=-1)?'Microsoft.XMLHTTP':'Msxml2.XMLHTTP'
        );
    }
    return xmlHttp; 
}

function initElements() {
    var forgetpw = $('forgetpw');
    forgetpw.onmouseover = function () { forgetpw.style.cursor="pointer"; }
    forgetpw.onclick = function () { window.location = '/another.html'; }
    
    var kLabel = $('kLabel');
    kLabel.onclick = function () {
        var keepIn = $('keepIn');
        if (keepIn.checked==true) {
            keepIn.checked=false;
        } else {
            keepIn.checked=true;
        }
    }
    kLabel.onmouseover = function () { kLabel.style.cursor="pointer"; }
    
    var user = $('user');
    user.onkeydown = function() {
        if (user.value.trim().length>0) {$('msg').innerText='';}
    }
    var pw = $('pw');
    pw.onkeydown = function() {
        if (pw.value.trim().length>0) {$('msg').innerText='';}
    }
    
    var btn = $('btn');
    btn.onmouseover = function () { btn.style.cursor="pointer"; }
    btn.onmousedown = function () { btn.className='clickBtn';}
    btn.onmouseup = function () { btn.className='submitBtn'; }
    btn.onmouseout = function () { btn.className='submitBtn';}
    btn.onclick = function () {
        if (user.value.trim().length==0) {
            $('msg').innerText = 'NOTE: Please input username.';
            return;
        } else if (pw.value.trim().length==0) {
            $('msg').innerText = 'NOTE: Please input password.';
            return;
        }
        var postdata = getFormData();
        var xhr = createXHR();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var result = eval('('+xhr.responseText+')');
                $('msg').innerText = result.errMsg;
                if (result.isLogin === 'true') {
                    if (result.keepIn === 'true') {
                        var data = {user:result.user, isLogin:result.isLogin};
                        setCookie(data);
                    }
                    window.location = '/success.html';
                }
            } else if (xhr.readyState == 4 && xhr.status == 0) {
                $('msg').innerText = 'ERROR: Server is not running.';
            } else {
                $('msg').innerText = xhr.readyState+' '+xhr.status;
            }
        }
        xhr.open("POST", "http://localhost:8080/login");
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(postdata);
    }
}

function init() {
    if (getCookie('isLogin')==='true') {
        window.location = '/success.html';
    }
    var panel = '';
    var signIn = $('signIn');
    signIn.onmouseover = function () { signIn.style.cursor="pointer"; }
    signIn.onclick = function () {
        $('left').style.opacity=".72";
        signIn.style.borderBottom="solid 2px #ddd";
        $('right').style.opacity=".5";
        register.style.borderBottom="0";
        if (panel.length>0) {
            $('panel').innerHTML=panel;
            initElements();
        }
    }
    
    var register = $('register');
    register.onmouseover = function () { register.style.cursor="pointer"; }
    register.onclick = function () {
        $('left').style.opacity=".5";
        signIn.style.borderBottom="0";
        $('right').style.opacity=".72";
        register.style.borderBottom="solid 2px #ddd";
        panel = $('panel').innerHTML;
        $('panel').innerHTML='<div class="msg">THIS IS A DEMO.</div>';
    }
    
    initElements();
}

window.onload=init;
