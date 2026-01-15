interface Props {
    buttonActionName: string;
    callback: (...args: any[]) => any;
}

export default function SendRequestButton({buttonActionName, callback}: Props) {
    return (
        <button
        onClick={callback}>
            {buttonActionName}</button>
    );
}