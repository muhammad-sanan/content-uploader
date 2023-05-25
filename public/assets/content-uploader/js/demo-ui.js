  /*
   * Some helper functions to work with our UI and keep our code cleaner
   */

// Adds an entry to our debug area
function ui_add_log(message, color)
{
  var d = new Date();

  var dateString = (('0' + d.getHours())).slice(-2) + ':' +
    (('0' + d.getMinutes())).slice(-2) + ':' +
    (('0' + d.getSeconds())).slice(-2);

  color = (typeof color === 'undefined' ? 'muted' : color);

  var template = $('#debug-template').text();
  template = template.replace('%%date%%', dateString);
  template = template.replace('%%message%%', message);
  template = template.replace('%%color%%', color);
  
  $('#debug').find('li.empty').fadeOut(); // remove the 'no messages yet'
  $('#debug').prepend(template);
}

// Creates a new file and add it to our list
function ui_multi_add_file(id, file)
{
  var template = $('#files-template').text();
  template = template.replace('%%filename%%', file.name);

  template = $(template);
  template.prop('id', 'uploaderFile' + id);
  template.data('file-id', id);

  $('#files').find('li.empty').fadeOut(); // remove the 'no files yet'
  $('#files').prepend(template);

  // Show file along with progress. This is custom code.
  if (file.type.startsWith("image/")) {
    let blob = new Blob([file], { type: file.type });
    let imgUrl = URL.createObjectURL(blob);
    
    let img = document.createElement("img");
    img.src = imgUrl;
    $(img).width(64).height(64).addClass("mb-2 mr-3");
    
    $('#uploaderFile' + id).prepend(img);
  } else if (file.type.startsWith("video/")) {
    var video = $("<video>");
    video.attr("src", URL.createObjectURL(file));
    
    video.on('loadedmetadata', function() {
      const canvas = $('<canvas>')[0];
      canvas.width = video[0].videoWidth;
      canvas.height = video[0].videoHeight;
      const context = canvas.getContext('2d');
      
      // Set the current time to 1 second
      video[0].currentTime = 1;
      
      // Wait for the seeked event to fire to ensure that the video has seeked to the specified time
      video.on('seeked', () => {
        context.drawImage(video[0], 0, 0, canvas.width, canvas.height);
        const image = $('<img>', { src: canvas.toDataURL() });
        
        // Prepend the image element to the body
        $(image).width(64).height(64).addClass("mb-2 mr-3");
        $('#uploaderFile' + id).prepend(image);
      });
    });
  } else {
    // Prepend the image element to the body
    // $(image).width(64).height(64).addClass("mb-2 mr-3")
    var file_icon = 'assets/content-uploader/images/file.png';
    $('#uploaderFile' + id).prepend('<image src="' + file_icon + '" height="64" width="64" class="mb-2 mr-3">'); 
  }
}

// Changes the status messages on our list
function ui_multi_update_file_status(id, status, message)
{
  $('#uploaderFile' + id).find('span').html(message).prop('class', 'status text-' + status);
}

// Updates a file progress, depending on the parameters it may animate it or change the color.
function ui_multi_update_file_progress(id, percent, color, active)
{
  color = (typeof color === 'undefined' ? false : color);
  active = (typeof active === 'undefined' ? true : active);

  var bar = $('#uploaderFile' + id).find('div.progress-bar');

  bar.width(percent + '%').attr('aria-valuenow', percent);
  bar.toggleClass('progress-bar-striped progress-bar-animated', active);

  if (percent === 0){
    bar.html('');
  } else {
    bar.html(percent + '%');
  }

  if (color !== false){
    bar.removeClass('bg-success bg-info bg-warning bg-danger');
    bar.addClass('bg-' + color);
  }
}