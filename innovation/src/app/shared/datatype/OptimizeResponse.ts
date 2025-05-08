import {SolutionOverview} from './SolutionOverview';
import {Transport} from './Transport';

export interface OptimizeResponse {
    "solutionOverview": SolutionOverview,
    "transportPlan": {
        "transports": Transport[]
    }
}
