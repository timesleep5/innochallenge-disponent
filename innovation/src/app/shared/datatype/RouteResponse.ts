import {Coordinate} from './Coordinate';

export interface RouteResponse {
    "pins": Coordinate[],
    "route": Coordinate[]
}
