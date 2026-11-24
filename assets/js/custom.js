$(function () {

    // Header Scroll
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 60) {
            $("header").addClass("fixed-header");
        } else {
            $("header").removeClass("fixed-header");
        }
    });


    // Header menu: mark the current page. The header markup is identical on every
    // page (see scripts/check_partials.py), so the active state is set here.
    (function () {
        var file = window.location.pathname.split("/").pop() || "index.html";
        var target = file;
        if (file === "project-command.html" || file === "beelevel.html") {
            target = "index.html#products";
        } else if (/^work-/.test(file)) {
            target = "projects.html";
        } else if (file === "index.html" && window.location.hash) {
            target = "index.html" + window.location.hash;
        }
        var $links = $(".header-menu .header-link");
        var $match = $links.filter(function () { return $(this).attr("href") === target; });
        if (!$match.length) {
            $match = $links.filter(function () { return $(this).attr("href") === file; });
        }
        $match.addClass("active").attr("aria-current", "page");
    })();


    // Footer year
    $(".js-year").text(new Date().getFullYear());


    // Featured Owl Carousel
    if ($.fn.owlCarousel) {
        $('.featured-projects-slider .owl-carousel').owlCarousel({
            center: true,
            loop: true,
            margin: 30,
            nav: false,
            dots: false,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 3
                },
                1200: {
                    items: 4
                }
            }
        });
    }


    // Count: animates each .count from 0 up to the integer written in its text
    $('.count').each(function () {
		$(this).prop('Counter', 0).animate({
			Counter: $(this).text()
		}, {
			duration: 1000,
			easing: 'swing',
			step: function (now) {
				$(this).text(Math.ceil(now));
			}
		});
	});


    // ScrollToTop
    var scrollBtn = document.getElementById("scrollToTopBtn");
    if (scrollBtn) {
        scrollBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener("scroll", function () {
            if (document.documentElement.scrollTop > 100 || document.body.scrollTop > 100) {
                scrollBtn.style.display = "flex";
            } else {
                scrollBtn.style.display = "none";
            }
        });
    }


    // Aos
	AOS.init({
		once: true,
	});

});
