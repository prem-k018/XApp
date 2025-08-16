export type EventField = {
    name: string;
    type: string;
    description: string | null;
};

export type EventSchema = {
    fields: EventField[];
};

export type EventSchemaItem = {
    event_type: string;
    event_name: string;
    event_schema: EventSchema;
    active: boolean;
    created_at: string;
};

export type EventSchemaList = {
    eventSchemaList: EventSchemaItem[];
    total: {
        filtered: number;
    };
};

export type CustomEventSchemaResponse = {
    data: {
        users_getCustomEventSchemaList: EventSchemaList
    }
};
