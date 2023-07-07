import ContentModal from "../../../Components/Modal";
import { IContentModal } from "../../../Defaulds";

export default function ConfirmArbitrageAutoMode(props: IContentModal) {
    const { ...oterProps } = props

    return (
        <ContentModal {...oterProps} position="middle">

        </ContentModal>
    )

}