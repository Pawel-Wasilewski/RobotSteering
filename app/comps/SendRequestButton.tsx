interface Props {
    message: string;
    callback: (...args: any[]) => any;
}

export default function SendRequestButton({message, callback}: Props) {
    return (
        <button
        onClick={callback}>
            {message}</button>
    );
}