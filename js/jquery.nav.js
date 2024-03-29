/*
 * jQuery One Page Nav Plugin
 * http://github.com/davist11/jQuery-One-Page-Nav
 *
 * Copyright (c) 2010 Trevor Davis (http://trevordavis.net)
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://jquery.org/license
 *
 * @version 2.2.0
 *
 * Example usage:
 * $('#nav').onePageNav({
 *   currentClass: 'current',
 *   changeHash: false,
 *   scrollSpeed: 750
 * });
 */
;
(function($, window, document, undefined) {
    var OnePageNav = function(elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.metadata = this.$elem.data('plugin-options');
        this.$nav = this.$elem.find('a');
        this.$win = $(window);
        this.sections = {};
        this.didScroll = false;
        this.$doc = $(document);
        this.docHeight = this.$doc.height();
    };
    OnePageNav.prototype = {
        defaults: {
            currentClass: 'current',
            changeHash: false,
            easing: 'swing',
            filter: '',
            scrollSpeed: 750,
            scrollOffset: 0,
            scrollThreshold: 0.5,
            begin: false,
            end: false,
            scrollChange: false
        },
        init: function() {
            var self = this;
            self.config = $.extend({}, self.defaults, self.options, self.metadata);
            if (self.config.filter !== '') {
                self.$nav = self.$nav.filter(self.config.filter);
            }
            self.$nav.on('click.onePageNav', $.proxy(self.handleClick, self));
            self.getPositions();
            self.bindInterval();
            self.$win.on('resize.onePageNav', $.proxy(self.getPositions, self));
            return this;
        },
        adjustNav: function(self, $parent) {
            self.$elem.find('.' + self.config.currentClass).removeClass(self.config.currentClass);
            $parent.addClass(self.config.currentClass);
        },
        bindInterval: function() {
            var self = this;
            var docHeight;
            self.$win.on('scroll.onePageNav', function() {
                self.didScroll = true;
            });
            self.t = setInterval(function() {
                docHeight = self.$doc.height();
                if (self.didScroll) {
                    self.didScroll = false;
                    self.scrollChange();
                }
                if (docHeight !== self.docHeight) {
                    self.docHeight = docHeight;
                    self.getPositions();
                }
            }, 250);
        },
        getHash: function($link) {
            var attr = $link.attr('href');
        	if (typeof attr !== typeof undefined && attr !== false) {
        		return $link.attr('href').split('#')[1];
	    	}
	    	else{
	    		return $link.attr('data-target').split('#')[1];
	    	}
        },
        getPositions: function() {
            var self = this;
            var linkHref;
            var topPos;
            var $target;
            self.$nav.each(function() {
                linkHref = self.getHash($(this));
                $target = $('#' + linkHref);
                if ($target.length) {
                    topPos = $target.offset().top;
                    self.sections[linkHref] = Math.round(topPos) - self.config.scrollOffset;
                }
            });
        },
        getSection: function(windowPos) {
            var returnValue = null;
            var windowHeight = Math.round(this.$win.height() * this.config.scrollThreshold);
            for (var section in this.sections) {
                if ((this.sections[section] - windowHeight) < windowPos) {
                    returnValue = section;
                }
            }
            return returnValue;
        },
        /*handleClick: function(e) {
            var self = this;
            var $link = $(e.currentTarget);
            console.log(e.target.href);
            var $parent = $link.parent();
            var newLoc = '#' + self.getHash($link);
            if (!$parent.hasClass(self.config.currentClass)) {
                if (self.config.begin) {
                    self.config.begin();
                }
                self.adjustNav(self, $parent);
                self.unbindInterval();
                $.scrollTo(newLoc, self.config.scrollSpeed, {
                    axis: 'y',
                    easing: self.config.easing,
                    offset: {
                        top: -self.config.scrollOffset
                    },
                    onAfter: function() {
                        if (self.config.changeHash) {
                            window.location.hash = newLoc;
                        }
                        self.bindInterval();
                        if (self.config.end) {
                            self.config.end();
                        }
                    }
                });
            }
            else{
            	window.location;href = $link.href;
            }
            e.preventDefault();
        },*/
        scrollChange: function() {
            var windowTop = this.$win.scrollTop();
            var position = this.getSection(windowTop);
            var $parent;
            if (position !== null) {
                $parent = this.$elem.find('a[href$="#' + position + '"]').parent();
                if (!$parent.hasClass(this.config.currentClass)) {
                    this.adjustNav(this, $parent);
                    if (this.config.scrollChange) {
                        this.config.scrollChange($parent);
                    }
                }
            }
        },
        unbindInterval: function() {
            clearInterval(this.t);
            this.$win.unbind('scroll.onePageNav');
        }
    };
    OnePageNav.defaults = OnePageNav.prototype.defaults;
    $.fn.onePageNav = function(options) {
        return this.each(function() {
            new OnePageNav(this, options).init();
        });
    };
})(jQuery, window, document);