/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

import { Header } from '@/components/header';
import { Input } from '@/components/input';
import { Product } from '@/components/product';
import { Button } from '@/components/button';

import { Feather } from '@expo/vector-icons';

import { ProductCartProps, useCartStore } from '@/stores/cart-store';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { formatCurrency } from '@/utils/functions/format-currency';

import { View, Text, ScrollView, Alert, Linking } from 'react-native';
import { LinkButton } from '@/components/link-button';

import { useNavigation } from 'expo-router';

// código do país + DDD + Número de telefone
const PHONE_NUMBER = '55<DDD><Your Phone Number>';

export default function Cart() {
    const cartStore = useCartStore();
    const [adress, setAdress] = useState('');
    const navigation = useNavigation();

    const isDisabledToSend = cartStore.products.length == 0;

    const total = formatCurrency(
        cartStore.products.reduce(
            (total, product) => total + product.price * product.quantity,
            0
        )
    );

    const handleProductRemove = (product: ProductCartProps) => {
        Alert.alert('Remover', `Deseja remover ${product.title} do carrinho?`, [
            {
                text: 'Cancelar',
            },
            {
                text: 'Remover',
                onPress: () => cartStore.remove(product.id),
            },
        ]);
    };

    const handleOrder = () => {
        if (!adress.trim()) {
            return Alert.alert('Pedido', 'Informe os dados da entrega.');
        } else if (isDisabledToSend) {
            return Alert.alert('Pedido', 'Adicione algum produto no carrinho.');
        }

        const products = cartStore.products
            .map((product) => `\n ${product.quantity} ${product.title}`)
            .join('');

        const message = `
        🍔NOVO PEDIDO
        \n Entregar em: ${adress}

        ${products}

        \n Valor total: ${total};
        `;

        // Linking.openURL(
        //     `http://api.whatsapp.com/send?phone${PHONE_NUMBER}&text=${message}`
        // );

        cartStore.clear();

        navigation.goBack();
    };

    return (
        <View className="flex-1 pt-8">
            <Header title="Seu carrinho" />
            <KeyboardAwareScrollView>
                <ScrollView>
                    <View className="p-5 flex-1">
                        {cartStore.products.length > 0 ? (
                            <View className="border-b border-slate-700">
                                {cartStore.products.map((product) => (
                                    <Product
                                        data={product}
                                        key={product.id}
                                        onPress={() =>
                                            handleProductRemove(product)
                                        }
                                    />
                                ))}
                            </View>
                        ) : (
                            <Text className="font-body text-slate-400 text-center my-8">
                                Seu carrinho está vazio
                            </Text>
                        )}

                        <View className="flex-row gap-2 items-center mt-5 mb-4">
                            <Text className="text-white text-xl font-subtitle">
                                Total:
                            </Text>
                            <Text className="text-lime-400 text-2xl font-heading">
                                {total}
                            </Text>
                        </View>

                        <Input
                            placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
                            onChangeText={setAdress}
                            blurOnSubmit={true}
                            onSubmitEditing={handleOrder}
                            returnKeyType="send"
                        />
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>

            <View className="p-5 gap-5">
                <Button onPress={handleOrder} disabled={isDisabledToSend}>
                    <Button.Text>Enviar Pedido</Button.Text>
                    <Button.Icon>
                        <Feather name="arrow-right-circle" size={20} />
                    </Button.Icon>
                </Button>

                <LinkButton href="/" title="Voltar ao Cardápio" />
            </View>
        </View>
    );
}
