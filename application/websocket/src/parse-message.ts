export const parseMessage = (data) => {
    let message;
    try {
        message = JSON.parse(data);
    } catch (err) {
        return data;
    }

    return message;
};
