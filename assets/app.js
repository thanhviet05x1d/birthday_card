$(document).ready(function () {
  setupListImages();
  updatePreviewer();

  $("#image-field").change(function () {
    updatePreviewer();
  });
  $('#name-field').on('input', function (e) {
    updatePreviewer();
  });
  $("#previewer-image").on("load", function () {
    updatePreviewer();
  })
  $("#download").click(function () {
    download();
  });
});

const setupListImages = () => {
  $.each(IMAGES, function (i, item) {
    $('#image-field').append($('<option>', {
      value: i,
      text: item.name,
    }));
  });
}

const updatePreviewer = () => {
  const imageValue = $("#image-field").val();
  const nameValue = $("#name-field").val();
  const imageData = IMAGES[imageValue]

  const previewWidth = $('#previewer-sample').width();
  const zoom = Math.min(1, previewWidth / imageData.width);

  if ($('#previewer-image').attr('src') != imageData.image) {
    $('#previewer-image').attr("src", imageData.image);
  }

  $('#previewer-canvas')
    .css("zoom", zoom)
    .attr("height", imageData.height)
    .attr("width", imageData.width);

  // Draw text
  var image = document.getElementById("previewer-image");
  var canvas = document.getElementById("previewer-canvas");
  const ctx = canvas.getContext("2d")

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (image) {
    ctx.drawImage(image, 0, 0)
  }

  if (nameValue) {
    const p = imageData.position
    ctx.textAlign = imageData.align
    if (imageData.fontSize && imageData.fontName) {
      ctx.font = `${imageData.fontSize}px ${imageData.fontName}`;
    }
    if (imageData.color) {
      ctx.fillStyle = imageData.color;
    }
    if (imageData.rotate) {
      ctx.rotate(imageData.rotate * Math.PI / 180);
    }
    ctx.fillText(nameValue, p[0], p[1])
  }
}

const download = () => {
  const canvas = document.getElementById("previewer-canvas");
  const dataURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
  var nameValue = $("#name-field").val();
  nameValue = nameValue.replace(' ', '-');

  var a = document.createElement('a');
  a.href = dataURL;
  a.download = nameValue + '.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a)
}