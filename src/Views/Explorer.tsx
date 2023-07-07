import Master from "../Layouts/Master"
import { Link, useSearchParams } from 'react-router-dom'
import ExploreNewPairs from "./Partials/ExploreNewPairs";
import { Grid, } from '@mui/material/'
import SwapTokens from "./Partials/Snipper/SwapTokens";




export default () => {

    const [searchParams, setSearchParams] = useSearchParams({ page: 'pairs' });

    return (
        <Master>
            <Grid className="dash" >
                {searchParams.get('page') === 'pairs' && <ExploreNewPairs />}
                {searchParams.get('page') === 'swap' && <SwapTokens />}
            </Grid>
        </Master>
    )
}