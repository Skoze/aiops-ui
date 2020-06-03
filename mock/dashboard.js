import globaldata from './global.json';
import database from './database.json';
import instance from './instance.json';
import endpoint from './endpoint.json';
import service from './service.json';
export default {
    'POST /aiops/global/': (req, res) => {
        res.end(
            JSON.stringify(globaldata),
        );
    },
    'POST /aiops/database/': (req, res) => {
        res.end(
            JSON.stringify(database),
        );
    },
    'POST /aiops/instance/': (req, res) => {
        res.end(
            JSON.stringify(instance),
        );
    },
    'POST /aiops/service/': (req, res) => {
        res.end(
            JSON.stringify(service),
        );
    },
    'POST /aiops/endpoint/': (req, res) => {
        res.end(
            JSON.stringify(endpoint),
        );
    },
}