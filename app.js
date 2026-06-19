
function formatBytes(bytes){
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function sha256(file){

    const buffer = await file.arrayBuffer();

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            buffer
        );

    const hashArray =
        Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(b => b.toString(16).padStart(2,"0"))
        .join("");
}

async function scanImages(){

    const files =
        document.getElementById("imageInput").files;

    if(files.length === 0){
        alert("Chưa chọn ảnh");
        return;
    }

    const hashMap = {};
    let duplicateFiles = [];

    for(const file of files){

        const hash = await sha256(file);

        if(!hashMap[hash]){
            hashMap[hash] = [];
        }

        hashMap[hash].push(file);
    }

    for(const hash in hashMap){

        if(hashMap[hash].length > 1){

            for(let i = 1; i < hashMap[hash].length; i++){
                duplicateFiles.push(hashMap[hash][i]);
            }
        }
    }

    document.getElementById("result").innerHTML =
        "<h2>Kết quả</h2>" +
        "<p>Tổng ảnh: " + files.length + "</p>" +
        "<p>Ảnh trùng: " + duplicateFiles.length + "</p>";

    if(duplicateFiles.length > 0){

        const confirmDelete = confirm(
            "Phát hiện " +
            duplicateFiles.length +
            " ảnh trùng.\n\nBạn có muốn xóa không?"
        );

        if(confirmDelete){

            alert(
                "Đã chọn xóa " +
                duplicateFiles.length +
                " ảnh trùng"
            );
        }
    }
}

</script>
