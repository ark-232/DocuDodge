function displayFileContent() {
    var input = document.getElementById('file-input');
    var file = input.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var codeElement = document.getElementById('file-content').querySelector('code');
            codeElement.innerText = e.target.result; // Use innerText to preserve formatting
        };
        reader.readAsText(file);
    }
}



function commentFile() {
    var input = document.getElementById('file-input');
    var file = input.files[0];
    
    if (file) {
        var content = document.getElementById('file-content').querySelector('code').innerText;
        var formData = new FormData();
        formData.append('file_content', content);
        formData.append('filename', file.name);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/comment', true);

        xhr.onloadstart = function() {
            document.getElementById('loading-bar').style.display = 'block';
            document.querySelector('.loading-bar').style.width = '100%'; // Start loading bar
        };

        xhr.onloadend = function() {
            document.getElementById('loading-bar').style.display = 'none';
            document.querySelector('.loading-bar').style.width = '0'; // Reset loading bar
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                let responseText = xhr.responseText;
                // Split the response into lines
                let lines = responseText.split('\n');
                // Remove the first and last lines (the Markdown code block syntax)
                if (lines.length >= 3) {
                    lines = lines.slice(1, -1);
                }
                // Join the remaining lines back into a single string
                responseText = lines.join('\n');
    
                // Get the 'code' element within 'comments' element
                var codeElement = document.getElementById('comments').querySelector('code');
                // Set the innerText of this element to the cleaned server response
                codeElement.innerText = responseText;
            } else {
                alert('Error commenting file. Try again.');
            }
        };

        xhr.onerror = function() {
            document.getElementById('loading-bar').style.display = 'none';
            document.querySelector('.loading-bar').style.width = '0'; // Reset loading bar
            alert('Error during request. Try again.');
        };

        xhr.send(formData);
    } else {
        alert('Please select a file first.');
    }
}
