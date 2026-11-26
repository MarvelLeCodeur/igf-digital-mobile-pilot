import type { ComponentRef } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, ScrollView, TextInput, View } from 'react-native';
import type { ScrollViewProps } from 'react-native';

export function FormScrollView({ onScroll, style, ...props }: ScrollViewProps) {
    const frame = useRef<ComponentRef<typeof View>>(null);
    const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
    const offset = useRef(0);
    const animation = useRef(0);
    const keyboardTop = useRef<number | undefined>(Keyboard.metrics()?.screenY);
    const [overlap, setOverlap] = useState(0);

    const updateViewport = useCallback(() => {
        cancelAnimationFrame(animation.current);
        animation.current = requestAnimationFrame(() => {
            frame.current?.measureInWindow((_x, top, _width, height) => {
                const keyboard = keyboardTop.current;
                const bottom = Math.min(top + height, keyboard ?? Infinity);
                // Expo Go peut laisser le clavier recouvrir la fenetre. Si Android a deja
                // reduit la fenetre, le chevauchement vaut zero et on ne retire rien de plus.
                setOverlap(Math.max(0, Math.ceil(top + height - bottom)));
                const input = TextInput.State.currentlyFocusedInput();
                if (!input || !frame.current?.contains(input) || (keyboard == null && !Keyboard.isVisible())) return;
                input.measureInWindow((_left, inputTop, _inputWidth, inputHeight) => {
                    if (input !== TextInput.State.currentlyFocusedInput()) return;
                    const below = inputTop + inputHeight + 16 - bottom;
                    const above = inputTop - top - 12;
                    if (below > 0 || above < 0) {
                        scroll.current?.scrollTo({
                            y: Math.max(0, offset.current + (below > 0 ? below : above)),
                            animated: true,
                        });
                    }
                });
            });
        });
    }, []);

    useEffect(() => {
        const handleFrame = (event: { endCoordinates: { screenY: number } }) => {
            keyboardTop.current = event.endCoordinates.screenY;
            updateViewport();
        };
        const shown = Keyboard.addListener('keyboardDidShow', handleFrame);
        const hidden = Keyboard.addListener('keyboardDidHide', () => {
            keyboardTop.current = undefined;
            setOverlap(0);
        });
        const changed = Platform.OS === 'ios' ? Keyboard.addListener('keyboardDidChangeFrame', handleFrame) : undefined;
        return () => {
            shown.remove();
            hidden.remove();
            changed?.remove();
            cancelAnimationFrame(animation.current);
        };
    }, [updateViewport]);

    return (
        <View ref={frame} collapsable={false} style={{ flex: 1, minHeight: 0, paddingBottom: overlap }}
            onLayout={updateViewport}>
            <ScrollView {...props} ref={scroll} style={[{ flex: 1, minHeight: 0 }, style]}
                keyboardShouldPersistTaps="handled" keyboardDismissMode="none"
                onFocus={updateViewport} onLayout={updateViewport} scrollEventThrottle={16}
                onScroll={event => {
                    offset.current = event.nativeEvent.contentOffset.y;
                    onScroll?.(event);
                }} />
        </View>
    );
}
