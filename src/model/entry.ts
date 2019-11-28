export default class Entry {

    constructor(
        public readonly start: Date,
        public readonly story: string,
        public readonly notes: string,
        public end?: Date,
    ){ }

}
