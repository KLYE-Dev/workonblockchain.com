const cities = require('../../../../model/mongoose/cities');
const enumerations = require('../../../../model/enumerations');

module.exports = async function (req, res) {
    let queryInput = req.body;
    const filteredExp = queryInput.autosuggest.replace(/[#^*~?{}|&;$%',.-_@"<>()+]/g, "");
    let regex = new RegExp(filteredExp, 'i');
    let outputOptions = [];

    if(regex.test('Remote') || regex.test('Global')) {
        outputOptions.push({remote : true});
    }

    let citiesDoc = await cities.findAndLimit4({city: {$regex: regex}});
    if(citiesDoc) {
        for(let cityLoc of citiesDoc) {
            outputOptions.push({city : cityLoc});
        }

        if(queryInput.options && queryInput.options.countries === true) {
            for(let countryLoc of citiesDoc) {
                outputOptions.push({country : countryLoc.country});
            }
        }

    }
    if(queryInput.options && queryInput.options.countries === true) {
        const countriesEnum = enumerations.countries;
        let count = 0;
        for(let countryEnum of countriesEnum) {
            if(regex.test(countryEnum) && count < 2) {
                outputOptions.push({country : countryEnum});
                count++;
            }
        }
    }

    res.send({
        locations: outputOptions
    });

}