var elem = document.querySelector(".grid");
    var msnry = new Masonry(elem, {
        // options
        itemSelector: ".grid-item",
    });
    imagesLoaded( elem ).on( 'progress', function() {
    // layout Masonry after each image loads
    msnry.layout();
    });