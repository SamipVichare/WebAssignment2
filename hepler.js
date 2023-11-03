const Handlebars = require('handlebars');
Handlebars.registerHelper('ratingHelper', function(rating, options) {
    if (rating !== 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('isZeroRating', function(value) {
    return value === "zero";
});

module.exports = Handlebars;

