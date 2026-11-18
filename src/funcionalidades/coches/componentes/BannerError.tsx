type Props = {
    mensaje: string;
    alReintentar?: () => void;
};

export function BannerError({ mensaje, alReintentar }: Props) {
    return (
        <div className="banner-error" role="alert">
            <p>{mensaje}</p>
            {alReintentar && (
                <button type="button" onClick={alReintentar}>
                    Reintentar
                </button>
            )}
        </div>
    );
}