import Button from './Button'
import { GiMiner } from "react-icons/gi";


export const MineButton = ({onClick}) => {
    return (
        <div>
            
        <Button text="mine" color="blue" kind={<GiMiner></GiMiner>} >
        
        </Button>
        </div>
    )
}

export default MineButton
