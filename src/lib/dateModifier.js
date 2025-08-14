
export const DateModifier = (date) => {
    const readableDate = new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return readableDate
}