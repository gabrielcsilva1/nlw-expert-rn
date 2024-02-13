import { ReactNode } from 'react';

import { TouchableOpacity, TouchableOpacityProps, Text } from 'react-native';

import clsx from 'clsx';

type ButtonProps = TouchableOpacityProps & {
    children: ReactNode;
};

type ButtonTextProps = {
    children: ReactNode;
};

type ButtonIconProps = {
    children: ReactNode;
};

function Button({ children, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity
            className={clsx(
                'h-12 bg-lime-400 rounded-md items-center justify-center flex-row',
                rest.disabled && 'opacity-50'
            )}
            activeOpacity={0.7}
            {...rest}
        >
            {children}
        </TouchableOpacity>
    );
}

function ButtonText({ children }: ButtonTextProps) {
    return (
        <Text className="text-black font-heading text-base mx-2">
            {children}
        </Text>
    );
}

function ButtonIcon({ children }: ButtonIconProps) {
    return children;
}

Button.Text = ButtonText;
Button.Icon = ButtonIcon;

export { Button };
