(function(){
    console.log("Initializing Delshift cms");
    function addCMSActionButtons(){
        var scriptEle = document.getElementById('__delshift-script');
        if(scriptEle){
            var buttonEle = document.createElement('div');
            buttonEle.setAttribute('id', '__del-action-ele')
            buttonEle.innerHTML = scriptEle.innerHTML;
            document.body.appendChild(buttonEle);
            window.__delLoader = document.getElementById('__delshift-loader');
            toggleLoader(false);
        }
        console.log("Attaching the action button");
    }
    function addEditablesInPage(){
        var editables = document.querySelectorAll('h1, h2,  h3, h4, h5, h6, p, a, span');
        if(editables.length){
            for(var i=0; i< editables.length; i++){
                if(!editables[i]._attached){
                    if(!editables[i].closest('[__del-editable]') || (editables[i].parentElement != editables[i].closest('[__del-editable]'))){
                        editables[i].setAttribute('__del-editable', true);
                        if(editables[i].firstElementChild && editables[i].firstElementChild.hasAttribute('__del-editable')){
                            editables[i].firstElementChild.removeAttribute('__del-editable');
                        }
                        editables[i]._attached = true;
                        if(editables[i].getAttribute('contenteditable')){
                            editables[i].setAttribute('__del-contenteditable-true', true);
                        }
                        editables[i].addEventListener('click', (e)=> {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Editable elemnt >> ", e); 
                            e.target.setAttribute('contenteditable', true);
                            setTimeout(()=> {
                                e.target.focus();
                            }, 50);
                        });
                        editables[i].addEventListener('blur', e=> {
                            if(e.target){
                                e.target.removeAttribute('contenteditable');
                            }
                        });    
                    }                
                }
            }
        }

    }
    document.addEventListener('DOMContentLoaded',()=> {
        addEditablesInPage();
        addCMSActionButtons();
        
        var actionButtonEle = document.getElementById('__del-action-init');
        if(actionButtonEle){
            actionButtonEle.addEventListener('click', (e)=> {
                let _promRes = confirm('Are you done with changes?');
                if(_promRes){
                    updateContent()
                }
            });
        }
    });
    function updateContent(){
        toggleLoader(true, 'Updating page cont');
        serviceRequest({
            url:'updatePageContent',
            method: 'PUT',
            contentHeader: "application/json",
            body: JSON.stringify({fileName: window.__delshift.fileName, updatedContent: preProcessHTMLContent(document.body.innerHTML)})
        })
        .then(response => {
            console.log("updated page content");
        })
        .then(()=> {
            toggleLoader(false);
        })
        .catch(err => {
            toggleLoader(false);
            console.error("updated page content");
        });
    }
    function toggleLoader(show, message){
        if(window.__delLoader){
            show ?
            ((document.body.style.overflow="hidden") && window.__delLoader.classList.remove('__del-hide') && (window.__delLoader.innerText = message)):  
            ((document.body.style.overflow="auto") && window.__delLoader.classList.add('__del-hide'));
        }
    }
    function preProcessHTMLContent(content){
        if(content){
            var div = document.createElement('div');
            div.innerHTML = content;
            var editables = div.querySelectorAll('[__del-editable]');
            for(var i=0; i< editables.length; i++){
                editables[i].removeAttribute('__del-editable');
                if(!editables[i].hasAttribute('__del-contenteditable-true')){
                    editables[i].removeAttribute('contenteditable');
                }
                editables[i].removeAttribute('__del-contenteditable-true');
            }
            var __delElems = div.querySelectorAll('#__del-action-ele')
            for(var j=0; j< __delElems.length; j++){
                __delElems[j].parentElement.removeChild(__delElems[j]);
            }
            return div.innerHTML;
        }
    }
    
}());
const serviceRequest = option => {
    return new Promise((resolve, reject) => {
        if(!option.url.startsWith('http')){
            option.url = `${window.__delshift.apiBaseUrl}${option.url}`;
        }
        let xhr = new XMLHttpRequest();
        xhr.open(option.method || 'GET', option.url)
        xhr.setRequestHeader("Content-Type", option.contentHeader || "application/x-www-form-urlencoded");
        xhr.onload = () => {
            if(xhr.status >=200 && xhr.status < 400){
                try{
                    resolve(JSON.parse(xhr.response));
                } catch{
                    resolve(xhr.response);
                }
            } else{
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(option.body);
    });
};