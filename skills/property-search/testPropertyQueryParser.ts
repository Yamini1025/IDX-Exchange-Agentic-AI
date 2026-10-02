import { parsePropertyQuery } from "./propertyQueryParser"

const tests = [
    {
        query: "Show me 3-bedroom condos in Irvine under $1.5M with a pool.",
        expected: {
            city: "Irvine",
            maxPrice: 1500000,
            beds: 3,
            type: "Condominium",
            pool: "True",
        },
    },
    {
        query: "Find me 2-bedroom townhomes in San Diego under $900k with a pool.",
        expected: {
            city: "San Diego",
            maxPrice: 900000,
            beds: 2,
            type: "Townhouse",
            pool: "True",
        },
    },
    {
        query: "Looking for 4-bedroom single-family homes in Austin under $1.2M with a view.",
        expected: {
            city: "Austin",
            maxPrice: 1200000,
            beds: 4,
            type: "SingleFamilyResidence",
            hasView: "True",
        },
    },
    {
        query: "Show me 3-bed condos in Miami under $850000 and a pool.",
        expected: {
            city: "Miami",
            maxPrice: 850000,
            beds: 3,
            type: "Condominium",
            pool: "True",
        },
    },
    {
        query: "Search for 1-bedroom apartments in Seattle under $650k.",
        expected: {
            city: "Seattle",
            maxPrice: 650000,
            beds: 1,
        },
    },
    {
        query: "Find 2-bedroom homes in Orange County under $800k with a pool and 2 baths.",
        expected: {
            city: "Orange County",
            maxPrice: 800000,
            beds: 2,
            baths: 2,
            pool: "True",
        },
    },
    {
        query: "Need a 5-bedroom house in Phoenix under $2M with 3 baths and a view.",
        expected: {
            city: "Phoenix",
            maxPrice: 2000000,
            beds: 5,
            baths: 3,
            hasView: "True",
        },
    },
    {
        query: "Show me 2-bed, 2-bath condos in Las Vegas under $550000.",
        expected: {
            city: "Las Vegas",
            maxPrice: 550000,
            beds: 2,
            baths: 2,
            type: "Condominium",
        },
    },
    {
        query: "Find a 3-bedroom property in Denver under $750k with 1,200 sqft.",
        expected: {
            city: "Denver",
            maxPrice: 750000,
            beds: 3,
            sqft: 1200,
        },
    },
    {
        query: "Looking for 4-bedroom, 2.5-bath townhomes in Raleigh under $1.1M with a pool.",
        expected: {
            city: "Raleigh",
            maxPrice: 1100000,
            beds: 4,
            baths: 2.5,
            type: "Townhouse",
            pool: "True",
        },
    },
]

async function runTests() {
    let passed = 0

    for (const test of tests) {
        const result = await parsePropertyQuery(test.query);
        let success = true;

        for (const [key, expectedValue] of Object.entries(test.expected)) {
            if (result[key as keyof typeof result] !== expectedValue) {
                success = false;
                console.log(`Failed ${test.query}`);
                console.log(`Expected ${key}: ${expectedValue}`);
                console.log(`Got: ${result[key as keyof typeof result]}`);
            }
        }

        if (success) {
            passed++;
            console.log(`Passed ${test.query}`);
        }
    }
    console.log(`\n${passed}/${tests.length} tests passed`);
}

runTests();
