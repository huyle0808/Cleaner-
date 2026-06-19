function formatBytes(bytes){
return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function scanImages(){

    const files = Array.from(
        document.getElementById("imageInput").files
    );

    if(files.length === 0){
        alert("Chưa chọn ảnh");
        return;
    }

    let totalSize = 0;

    const map = {};
    const duplicates = [];

    files.forEach(file => {

        totalSize += file.size;

        const key = file.name + "_" + file.size;

        if(map[key]){
            duplicates.push(file);
        }else{
            map[key] = file;
        }

    });

    let html =
        "<h2>Kết quả</h2>" +
        "<p>Tổng số ảnh: " + files.length + "</p>" +
        "<p>Tổng dung lượng: " + formatBytes(totalSize) + "</p>" +
        "<p>Ảnh trùng: " + duplicates.length + "</p>";

    if(duplicates.length > 0){

        html += "<h3>Danh sách ảnh trùng</h3><ul>";

        duplicates.forEach(file => {
            html +=
                "<li>" +
                file.name +
                " (" +
                formatBytes(file.size) +
                ")" +
                "</li>";
        });

        html += "</ul>";

        if(confirm(
            "Tìm thấy " +
            duplicates.length +
            " ảnh trùng.\nBạn có muốn xóa khỏi danh sách không?"
        )){
            alert(
                "Đã loại bỏ " +
                duplicates.length +
                " ảnh trùng khỏi danh sách xử lý."
            );
        }

    }

    document.getElementById("result").innerHTML = html;
}
