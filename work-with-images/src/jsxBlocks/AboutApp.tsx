const AboutApp = () => {
    return (
        <div className="mainContent">
            <div className="additionInfo">
                <h2>About App</h2>
                <article>
                    In general, this is an application that contains a visual interface.
                    In this application, the user has the opportunity to select a file with a 24-bit BMP image in .bmp format
                    (by calling a system dialog), in the "likeness" of which (using the title and dimensions)
                    a file in .bmp format will be created, for each point of which a certain color dependence
                    on its coordinates will apply (the calculation is carried out from the upper left corner).
                    To save the newly created file, a corresponding system dialog is called.
                    The user is given the choice of one of two (soon to be 3) fundamentally different ways
                    of constructing a bitmap of the newly created file and a choice of two (soon to be 3)
                    color combinations for their implementation.
                    At the same time, it is possible to continue the session with the file selected
                    at the beginning without the need to call the open dialog again. At the same time,
                    the user has the opportunity to select a different file at any stage of working with the program.
                </article>
                <br/>
                <article>
                    Providing users with the ability to "invisibly" transmit a short text message by embedding it
                    in a BMP file with parameters and interaction methods similar to the previous point.

                    The message is transmitted as follows: each byte of information is decomposed into 8 bits
                    and each of these bits is written as the least significant bit in the current byte
                    of the color map of the BMP file.
                    The user has the ability to attach a message to a BMP file, but there is no way to retrieve a message from a BMP file.
                </article>
                <br/>
                <article>
                    This application is equipped with user authorization processes based on username and password.
                    For authorized users, the program "remembers" the last 3:
                    <ul>
                        <li>
                            BMP files with which any work was carried out;
                        </li>
                        <li>
                            The modes of creating a new bitmap that the user used;
                        </li>
                    </ul>
                    Still doesn't remember:
                    <ul>
                        <li>
                            Messages that were attached to a BMP file;
                        </li>
                        <li>
                            Messages that were received from a BMP file.
                        </li>
                    </ul>

                </article>
                <br/>
                <article>
                    After user authorization, the application does not yet activate the last
                    used by the user mode of operation with the last settings
                    that were used. However, the user has the opportunity to
                    load one of the three last modes (files, messages) that the application "remembers"
                </article>
                <br/>
                <article>
                    The user does not yet have the ability to deauthorize at any time
                    while preserving the current work settings
                </article>
                <br/>
                <article>
                    The user has the ability to call up information: "User manual", "About the program"
                    (this page itself) and "About the authors"
                </article>
            </div>
        </div>
    )
}

export default AboutApp