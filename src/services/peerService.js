import Peer from 'peerjs';

class PeerService {
    constructor() {
        this.peer = null;
        this.connection = null;
        this.onData = null;
        this.onConnect = null;
        this.onClose = null;
    }

    initialize(id = null) {
        return new Promise((resolve, reject) => {
            // Use a random ID if none provided, or specific one if hosting (though PeerJS generates one usually)
            this.peer = new Peer(id);

            this.peer.on('open', (id) => {
                console.log('My peer ID is: ' + id);
                resolve(id);
            });

            this.peer.on('error', (err) => {
                console.error('Peer connection error:', err);
                reject(err);
            });

            this.peer.on('connection', (conn) => {
                this.handleConnection(conn);
            });
        });
    }

    connect(peerId) {
        if (!this.peer) {
            throw new Error("Peer not initialized");
        }
        const conn = this.peer.connect(peerId);
        this.handleConnection(conn);
        return conn;
    }

    handleConnection(conn) {
        this.connection = conn;

        conn.on('open', () => {
            console.log('Connected to: ' + conn.peer);
            if (this.onConnect) this.onConnect(conn.peer);
        });

        conn.on('data', (data) => {
            if (this.onData) this.onData(data);
        });

        conn.on('close', () => {
            console.log('Connection closed');
            this.connection = null;
            if (this.onClose) this.onClose();
        })
    }

    send(data) {
        if (this.connection && this.connection.open) {
            this.connection.send(data);
        } else {
            console.warn("No active connection to send data to.");
        }
    }

    destroy() {
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
    }
}

export const peerService = new PeerService();
