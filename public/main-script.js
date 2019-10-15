(function(){
    console.log("Initializing Delshift cms");
    let duplicateTab = false;
    function attachImageModalElems(modalElem){
        if(modalElem){
            var fileInput = modalElem.querySelector('input[name="image-select"]'),
                targetInput = modalElem.querySelector('input[name="target-select"]');
            if(fileInput && targetInput){
                fileInput.addEventListener('change', (e)=> {
                    console.log("FILE INPUT CHANGE >> ", e);
                });
                targetInput.addEventListener('change', (e)=> {
                    console.log("FILE INPUT CHANGE >> ", e);
                });
            }
        }
        setTimeout(()=>{
            this.closeDialog({firstName: 'Abhishek', lastName: 'Khuntia'});
        }, 5000);  
    }
    function addCMSActionButtons(){
        var scriptEle = document.getElementById('__delshift-script');
        if(scriptEle){
            var buttonEle = document.createElement('div');
            buttonEle.setAttribute('id', '__del-action-ele')
            buttonEle.innerHTML = scriptEle.innerHTML;
            document.body.appendChild(buttonEle);
            window.__delLoader = document.getElementById('__delshift-loader');
        }
        console.log("Attaching the action button");
    }
    function setLiveAnchor(){
        var liveAnchor = document.getElementById('__delshift-live-anchor'),
            liveUrl = window.location.href.replace(new RegExp('edit/'), (window.__delshift.livePrefix+'/'));
            if(liveAnchor){
                liveAnchor.href = liveUrl;
            }
    }
    function addExternalScripts(){
        var externalScripts = document.querySelectorAll('external-script');
        for(var i=0; i< externalScripts.length; i++){
            if(externalScripts[i].hasAttribute('rel')){
                var extSrcType = externalScripts[i].getAttribute('type'),
                    scriptEle;
                switch(extSrcType){
                    case 'stylesheet':
                    scriptEle = document.createElement('link'),
                    scriptEle.setAttribute('href', externalScripts[i].getAttribute('rel')),
                    scriptEle.setAttribute('rel', 'stylesheet');
                    break;
                    case 'script':
                    scriptEle = document.createElement('script'),
                    scriptEle.setAttribute('src', externalScripts[i].getAttribute('rel'));
                    break;
                }
                document.head.appendChild(scriptEle);
                externalScripts[i].parentElement.removeChild(externalScripts[i]);
            }
        }
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
                        // editables[i]._attached = true;
                        if(editables[i].getAttribute('contenteditable')){
                            editables[i].setAttribute('__del-contenteditable-true', true);
                        }
                        editables[i].addEventListener('blur', e=> {
                            if(e.target){
                                e.target.removeAttribute('contenteditable');
                            }
                        });    
                    }                
                }
            }
        }
        document.addEventListener('click', (e)=> {
            if(e.target && e.target.closest('[__del-editable]')){
                var _target = e.target.closest('[__del-editable]');
                if(_target){
                    e.preventDefault();
                    e.stopPropagation();
                    _target.setAttribute('contenteditable', true);
                    setTimeout(()=> {
                        _target.focus();
                    }, 50);
                }
            }
        },{capture: true});

    }
    function attachCloseBannerEvent(){
        var bannerEle = document.getElementById('__delshift-banner'),
            closeBtn = document.getElementById('__delshift-close-anchor');
        if(bannerEle && closeBtn){
            closeBtn.addEventListener('click', (e)=> {
                if(e){
                    bannerEle.classList.add('__del-hide');
                }
            });
        }
    }
    document.addEventListener('DOMContentLoaded',()=> {
        addEditablesInPage();
        addCMSActionButtons();
        toggleLoader(false);
        // adding external - scripts
        addExternalScripts();
        setLiveAnchor();
        attachCloseBannerEvent();
        
        var actionButtonEle = document.getElementById('__del-action-init');
        if(actionButtonEle){
            actionButtonEle.addEventListener('click', (e)=> {
                let _promRes = confirm('Are you done with changes?');
                if(_promRes){
                    updateContent()
                }
            });
        }
        var imageElems = document.querySelectorAll('img');
        for(let i=0; i< imageElems.length; i++){
            imageElems[i].addEventListener('click', (e)=> {
                var currentImage = e.target.getAttribute('src');
                var dialogRef = new DialogService();
                dialogRef.openDialog({templateId:'__delshift-image-change', attached: attachImageModalElems, softClose: true})
                .then(data=> {
                    console.log("DIALOG SERVICE >>", data);
                })
                .catch(error => {
                    console.error("DIALOG SERVICE >> ", error);
                });              
            });
        }
    });
    window.addEventListener('beforeunload', (event)=> {
        if(!duplicateTab){
            serviceRequest({
                url: 'release-window',
                method: 'POST',
                contentHeader: "application/json",
                body: JSON.stringify({fileName: window.__delshift.fileName})
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
        }).then(response => {
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
    // DIALOG SERVICE - PRIVATE
    const DialogService = (function(){
        var dialogRef;
        function dialogService(){
            this.modalElem = document.getElementById('__delshift-modal-content');
            this.modalShade = document.getElementById('__delshift-modal');
        }
        dialogService.prototype.openDialog = function(option){
            return new Promise((resolve, reject)=> {
                if(dialogRef){
                    reject('DIALOG-OPEN-STATE');
                } else if(option.templateId){
                    var template = document.getElementById(option.templateId);
                    if(!template){
                        reject('TEMPLATE-NOT-FOUND');
                    } else if(this.modalElem){
                        this.modalElem.innerHTML = template.innerHTML;
                        this.modalElem.classList.remove('__del-hide');
                        this.modalShade.classList.remove('__del-hide');
                        if(option.attached && typeof(option.attached) == 'function'){
                            option.attached.call(this, this.modalElem);
                        }
                        var _self = this;
                        if(option.softClose){
                            if(!this.modalShade.__delAttached){
                                this.modalShade.__delAttached = true;
                                this.modalShade.addEventListener('click', _self.closeDialog.bind(this));
                            }
                        } else{
                            this.modalShade.__delAttached = false;
                            this.modalShade.removeEventListener('click', this.closeDialog);
                        }
                        dialogRef = resolve;
                    } else{
                        reject('MODAL-ELEM-MISSING');
                    }
                }
            });
        }
        dialogService.prototype.closeDialog = function(data){
            if(this.modalElem && this.modalShade){
                this.modalShade.classList.add('__del-hide');
                this.modalElem.classList.add('__del-hide');
                this.modalElem.innerHTML = '';
                if(typeof(dialogRef) == 'function'){
                    dialogRef({status: 'OK', data});
                    dialogRef = undefined;
                }
            }
        }
        return dialogService;
    }());
    // service reguest as promise
    const serviceRequest = option => {
        return new Promise((resolve, reject) => {
            if(!option.url.startsWith('http')){
                option.url = `${window.__delshift.apiBaseUrl}${option.url}`;
            }
            let xhr = new XMLHttpRequest();
            xhr.open(option.method || 'GET', option.url)
            xhr.setRequestHeader("Content-Type", option.contentHeader || "application/x-www-form-urlencoded");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
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
}());

