interface SchemaInfo {
    $schema: string;
    title: string;
    type: string;
    properties: Record<string, any>;
    required?: string[];
}
export declare class SchemasController {
    getAllSchemas(): {
        team: {
            add: SchemaInfo;
            show: SchemaInfo;
            update: SchemaInfo;
            del: SchemaInfo;
        };
        auth: {
            signin: SchemaInfo;
            signout: SchemaInfo;
        };
        user: {
            add: SchemaInfo;
            show: SchemaInfo;
            update: SchemaInfo;
            del: SchemaInfo;
        };
        reagent: {
            add: SchemaInfo;
            show: SchemaInfo;
            update: SchemaInfo;
            del: SchemaInfo;
        };
        operation: {
            inbound: SchemaInfo;
            outbound: SchemaInfo;
            specialOutbound: SchemaInfo;
            show: SchemaInfo;
            update: SchemaInfo;
            del: SchemaInfo;
        };
        lot: {
            add: SchemaInfo;
            show: SchemaInfo;
            update: SchemaInfo;
            del: SchemaInfo;
            showAll: SchemaInfo;
        };
        inventory: {
            show: SchemaInfo;
            auditAll: SchemaInfo;
            statistics: SchemaInfo;
        };
    };
}
export {};
