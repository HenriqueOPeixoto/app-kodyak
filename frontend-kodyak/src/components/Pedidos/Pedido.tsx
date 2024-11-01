import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Pedido() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open full-screen dialog
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'fixed', backgroundColor: '#074173' }}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }} >
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1, textAlign: 'center' }} variant="h6" component="div">
                            Pedido 00000
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>

                <div style={{ padding: '16px', marginTop: '64px', marginBottom: '64px' }}>

                    <div className='Cabecalho' style={{position: 'fixed', height: '100px'}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla magna, dignissim ut dapibus sit amet, lacinia eu enim. Aliquam vestibulum fermentum iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ut libero orci. Donec finibus, augue sit amet pellentesque cursus, turpis est gravida urna, ut euismod nisl enim vel felis. Maecenas hendrerit ante et lectus sodales vehicula. Nulla ac enim sed lorem sollicitudin malesuada. Morbi ac sem facilisis, aliquet massa quis, tempor quam. In purus risus, mattis quis dui vitae, sagittis hendrerit sem. Praesent lobortis vel ipsum in suscipit. Vivamus sit amet libero at leo posuere vulputate.

                        Nulla ac sollicitudin augue, nec lobortis mauris. Duis egestas lorem vel magna bibendum, et iaculis ipsum congue. Duis faucibus lectus tellus, tempus tincidunt eros tempus quis. Sed gravida, dolor a convallis ultricies, leo nulla elementum enim, nec rhoncus lectus dolor ut sem. Vivamus bibendum dui ac elit eleifend, at facilisis leo imperdiet. Etiam sed rhoncus nibh. Etiam blandit orci eget ornare tristique. Proin pharetra, nisl eu egestas ultricies, orci eros imperdiet enim, quis laoreet lorem tortor pellentesque velit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.

                        Mauris euismod bibendum est, eu sodales sem pharetra sit amet. Suspendisse in blandit ipsum. Integer nulla justo, congue id scelerisque ac, ornare nec nulla. Donec gravida diam in vehicula malesuada. Pellentesque tincidunt, lacus eget lobortis consectetur, tortor dui dictum mi, imperdiet blandit enim risus vel ante. Integer id eros tellus. Pellentesque imperdiet, augue eu commodo interdum, quam magna lobortis justo, commodo mattis massa orci ut orci. Cras ut ex ac metus ultrices dapibus ut in elit. Nam eget tristique nisl. Maecenas suscipit interdum dolor, non varius lacus faucibus iaculis. Etiam pellentesque mattis risus, vel efficitur eros vestibulum vel. Donec sollicitudin lectus massa, et pharetra tortor vulputate semper. Nunc maximus at lorem in blandit.
                    </div>
                    <div className='ListaProdutos' style={{position: 'fixed', marginTop:'200px', overflowY: 'auto', height:'50%', backgroundColor:'yellow', marginBottom:'100px', marginRight: '20px' }}>
                    <hr />

                        Ut sed posuere neque, vel vestibulum mauris. Donec blandit nibh nec neque molestie aliquet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum porta odio eget purus rhoncus, in interdum diam cursus. Integer blandit diam ut orci aliquam, non consectetur elit rhoncus. Praesent non libero non velit posuere ornare quis quis nisi. Aenean at nulla quis turpis accumsan malesuada vel sit amet orci. Fusce quis odio in nulla rutrum porttitor. Vestibulum nec orci facilisis, molestie neque ac, vulputate turpis. Sed commodo scelerisque erat, sit amet faucibus magna dignissim sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed fringilla velit nisl, hendrerit malesuada purus viverra a.

                        Curabitur ipsum elit, commodo ut orci sed, interdum maximus turpis. Cras vitae pretium sapien. Duis non rutrum ipsum. Nulla pulvinar est urna, in varius justo iaculis et. Duis varius bibendum libero quis finibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean vulputate elit quis neque rutrum, in sagittis est consectetur. Curabitur vitae metus ornare, congue metus at, congue nisi. Sed mi mi, semper ac ullamcorper eu, hendrerit eget odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu eleifend nisl. Curabitur eget cursus tellus. Suspendisse convallis, magna sit amet efficitur dictum, massa risus semper risus, in finibus nisi tellus at neque. Maecenas et diam urna. In felis magna, sagittis eget luctus vitae, hendrerit quis velit.

                        Nullam vel elit eget leo ullamcorper efficitur nec vitae nulla. Cras laoreet leo et blandit sollicitudin. Mauris sagittis metus vitae efficitur fringilla. Etiam tempor id enim at tincidunt. Integer eget urna dapibus, mollis tortor feugiat, consectetur augue. Donec eu quam vitae turpis condimentum lacinia sit amet nec elit. Fusce bibendum tellus ligula, in pharetra mi pharetra sit amet. Nunc mollis nisi nec feugiat blandit. Nunc a nisi at elit finibus faucibus a eu est. Etiam egestas dolor sit amet erat volutpat venenatis. Vivamus vestibulum ac mi sed vestibulum. Nunc blandit congue erat, in tempus ex.

                        Donec vitae turpis vehicula, finibus nunc id, sagittis dolor. Vestibulum arcu metus, consectetur ornare sem et, mollis efficitur nisi. Mauris enim neque, volutpat non dui ac, pellentesque elementum augue. Donec consectetur, ex id fermentum elementum, nulla nibh viverra neque, at ullamcorper lacus enim ac ex. Nunc consequat enim nibh, mollis eleifend quam tincidunt quis. Curabitur est lacus, vulputate ac fermentum vitae, vulputate eu purus. Aenean posuere justo eu purus hendrerit, quis accumsan felis lobortis. Cras mollis nulla ut tellus vestibulum malesuada. Nulla nec vulputate metus, vel varius arcu. Phasellus mattis ultricies purus, et accumsan velit laoreet a. Phasellus at orci in ex interdum accumsan vitae tristique neque. Nunc massa turpis, iaculis ac suscipit eu, gravida laoreet magna. Donec id turpis massa. Morbi dignissim sollicitudin dui sed viverra. Donec bibendum mi a urna pellentesque tincidunt eget in eros. Nunc finibus ac nisl eu viverra.

                        Aliquam luctus, nunc vel varius eleifend, quam lorem ullamcorper magna, nec sollicitudin tellus nisi quis lectus. Quisque volutpat, mi eget eleifend ultrices, orci urna aliquet lorem, at rutrum mi sapien et diam. Sed convallis, eros in elementum aliquam, metus leo fermentum mauris, id congue est sapien in ipsum. Morbi interdum tellus felis. Vivamus sit amet dolor fringilla, gravida sapien eget, euismod quam. Fusce auctor leo risus, eget consequat diam ultricies vitae. Donec feugiat id ex eget efficitur. Sed nec scelerisque eros. Mauris tortor leo, convallis eget ipsum quis, pellentesque facilisis massa.

                        Proin laoreet orci ut mauris tempor, id cursus felis rutrum. Maecenas massa augue, dignissim at vulputate et, semper at ligula. Quisque tristique, dolor sit amet pellentesque scelerisque, purus nunc congue urna, et vehicula mi libero viverra mi. Duis pretium sapien non massa facilisis venenatis. Praesent tristique, risus a facilisis egestas, est enim finibus ligula, sit amet aliquet nisi risus eget lectus. Nunc vestibulum tellus eros, bibendum molestie risus fermentum eu. Nam malesuada mauris magna, id porttitor dolor vulputate at. Nullam vulputate lobortis arcu, eu commodo mi molestie a. Ut a vehicula arcu. Duis euismod lobortis faucibus. Proin est nisl, vehicula id velit quis, aliquet sodales sem. Cras gravida purus egestas, malesuada ipsum eu, commodo massa.

                        Nam nec ipsum ac nunc convallis elementum vitae eget libero. Vivamus facilisis felis luctus augue mattis consectetur. Phasellus dui metus, venenatis vel dignissim sed, tincidunt quis nisl. Praesent luctus diam feugiat lectus hendrerit semper. Ut at diam mi. Morbi quis massa scelerisque, dictum mi tincidunt, aliquet sem. Nulla id dui sed nisl feugiat hendrerit. Sed auctor interdum aliquet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque tempus sem lacus, eget ultricies risus dapibus molestie.
                    
                    </div>
                </div>

                {/* Footer AppBar */}
                <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 , backgroundColor: '#074173'}}>
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" component="div">
                            © 2024 Your Company
                        </Typography>
                        <Button color="inherit" onClick={() => alert('Footer Button Clicked')}>
                            Footer Button
                        </Button>
                    </Toolbar>
                </AppBar>
            </Dialog>
        </React.Fragment>
    );
}
