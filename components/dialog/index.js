Component({
    properties: {
        type: {
            type: String,
            value: "equipment",
        },
        payload: {
            type: Object,
            value: {},
        },
    },
    data: {},
    methods: {},
    attached() {
        console.log('dialog component data', this.properties.payload)
    }
});
