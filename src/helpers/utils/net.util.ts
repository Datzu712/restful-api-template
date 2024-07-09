import { networkInterfaces } from 'os';

export function getIP(): string {
    const netInterfaces = networkInterfaces();

    const [{ address }] = Object.values(netInterfaces).flatMap(
        (netInterface) =>
            netInterface?.filter((prop) => prop.family === 'IPv4' && !prop.internal) as Array<{ address: string }>,
    );
    return address;
}
