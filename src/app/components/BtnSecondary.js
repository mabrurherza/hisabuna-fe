export default function BtnSecondary({id = "", name = "Action", variant, onClick, textColor = "text-black" }) {

    const getVariantClasses = () => {
        switch (variant) {
            default:
                return 'bg-zinc-300 hover:bg-zinc-400';
            case 'outline':
                return 'border border-zinc-300 hover:bg-zinc-100';
            case 'text':
                return textColor;
        }
    };

    return (
        <button
            className={`py-1 px-2 rounded text-sm ${getVariantClasses()}`}
            onClick={onClick}
        >
            {name}
        </button>)
}
