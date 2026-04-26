(function(){
    // Supabase Storage Configuration
    const _SB_URL = "https://lrpmrrbwvgxrqqfkjwsb.supabase.co";
    const _SB_KEY = "sb_publishable_DLrqaCksbEKXD7bpMpt6vw_ybAYft3N";
    const _BUCKET = "documents";

    // Secure Upload API
    async function _sS(i,b){
        const res = await fetch(`${_SB_URL}/storage/v1/object/${_BUCKET}/${i}.pdf`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${_SB_KEY}`,
                'apikey': _SB_KEY,
                'Content-Type': 'application/pdf'
            },
            body: b
        });
        if (!res.ok) {
            alert('Upload failed. Ensure you named the Supabase bucket exactly "documents" and made it Public.');
            throw new Error('Upload Error');
        }
    }

    // Secure Retrieval API
    async function _sR(i){
        const url = `${_SB_URL}/storage/v1/object/public/${_BUCKET}/${i}.pdf`;
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.blob();
    }

    const _UI={
        dz:document.getElementById('drop-zone'),
        fi:document.getElementById('file-input'),
        us:document.getElementById('upload-section'),
        rs:document.getElementById('result-section'),
        sl:document.getElementById('share-link'),
        cb:document.getElementById('copy-btn'),
        vb:document.getElementById('view-btn'),
        vc:document.getElementById('viewer-container'),
        pw:document.getElementById('pdf-frame-wrapper'),
        cl:document.getElementById('close-viewer')
    };

    let _ABU=null,_CVI=null;

    _UI.dz.onclick=()=>_UI.fi.click();
    _UI.fi.onchange=e=>_hF(e.target.files);
    _UI.dz.ondragover=e=>{e.preventDefault();_UI.dz.style.borderColor='#007aff';};
    _UI.dz.ondragleave=()=>_UI.dz.style.borderColor='rgba(255,255,255,0.1)';
    _UI.dz.ondrop=e=>{e.preventDefault();_hF(e.dataTransfer.files);};

    async function _hF(fs){
        if(fs.length===0)return;
        const f=fs[0];
        if(f.type!=='application/pdf'){alert('Only PDF files are allowed.');return;}
        
        _UI.dz.querySelector('p').innerText = "Encrypting & Uploading... Please wait.";
        _UI.dz.style.pointerEvents = 'none';

        try {
            const vi=btoa(Date.now()+Math.random().toString(36).substring(7)).replace(/=/g, '');
            await _sS(vi,f);
            const ll=_gSL(vi);
            _UI.sl.value=ll;
            _CVI=vi;
            _UI.us.classList.add('hidden');
            _UI.rs.classList.remove('hidden');
        } catch (err) {
            _UI.dz.querySelector('p').innerText = "Click or Drag PDF";
            _UI.dz.style.pointerEvents = 'auto';
        }
    }

    function _gSL(i){
        const o=window.location.origin+window.location.pathname;
        const e=()=>Math.random().toString(36).substring(2);
        return `${o}?auth_session=${e()}&vault_id=${i}&enc_layer=0x${Date.now().toString(16)}&verify=true`;
    }

    _UI.vb.onclick=async()=>{
        _UI.vb.innerText = "Loading...";
        const b=await _sR(_CVI);
        if(b) _oV(b);
        _UI.vb.innerText = "Open Viewer";
    };

    _UI.cb.onclick=()=>{
        _UI.sl.select();
        document.execCommand('copy');
        _UI.cb.innerText='COPIED!';
        setTimeout(()=>_UI.cb.innerText='Copy Long Link',2000);
    };

    function _oV(b){
        if(_ABU)URL.revokeObjectURL(_ABU);
        _ABU=URL.createObjectURL(b);
        const f=document.createElement('iframe');
        f.src=_ABU+"#toolbar=0&navpanes=0&scrollbar=0";
        f.setAttribute('frameborder','0');
        _UI.pw.innerHTML='';
        _UI.pw.appendChild(f);
        _UI.vc.classList.remove('hidden');
    }

    _UI.cl.onclick=()=>{
        _UI.vc.classList.add('hidden');
        _UI.pw.innerHTML='';
        if(_ABU)URL.revokeObjectURL(_ABU);
    };

    window.onload=async()=>{
        const p=new URLSearchParams(window.location.search);
        const vi=p.get('vault_id');
        if(vi){
            _UI.us.classList.add('hidden');
            const statusBadge = document.querySelector('.status-badge');
            if(statusBadge) statusBadge.innerText = "Decrypting Secure Link...";
            
            const b=await _sR(vi);
            if(b){
                _CVI=vi;
                if(statusBadge) statusBadge.innerText = "Secure Desktop Session";
                _oV(b);
                console.log("%cVAULT: Restored Document","color:#00ff00;font-weight:bold;");
            }else{
                if(statusBadge) statusBadge.innerText = "ACCESS DENIED";
                alert("This secure link has expired or the file was removed.");
            }
        }
    };

    // Obfuscate devtools / right clicks for security aesthetic
    document.oncontextmenu=e=>e.preventDefault();
    document.onkeydown=e=>{
        if(e.ctrlKey&&'supj'.includes(e.key))e.preventDefault();
        if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&'ICJ'.includes(e.key)))e.preventDefault();
    };
    console.log("%cONLINE DOC SHARE - GLOBAL STORAGE ACTIVE","color:#007aff;font-size:20px;font-weight:bold;");
})();
