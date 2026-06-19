function formatBytes(bytes){
return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function scanImages(){

    const input = document.getElementById("imageInput");

    alert(
        "files = " + input.files.length +
        "\nvalue = " + input.value
    );

}