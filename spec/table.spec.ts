import { getComparator, stableSort } from "../src/table";

describe("table", function () {
    var sortedValues;

    describe("stableSort", () => {
        it("filtrs values in ascending order", function () {
            sortedValues = stableSort([{ value: 1 }, { value: 5 }, { value: 3 }], getComparator("asc", "value"));

            expect(sortedValues).toEqual([{ value: 1 }, { value: 3 }, { value: 5 }]);
        });

        it("filtrs values in descending order", function () {
            sortedValues = stableSort([{ value: 1 }, { value: 5 }, { value: 3 }], getComparator("desc", "value"));

            expect(sortedValues).toEqual([{ value: 5 }, { value: 3 }, { value: 1 }]);
        });
    });
});
